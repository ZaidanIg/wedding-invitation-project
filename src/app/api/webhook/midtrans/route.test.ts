import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto';
import { sendInvoiceEmail } from '../../../../lib/email';

// Provide globals for Next.js Web API in Node (Jest)
global.Request = class Request {
  method: string;
  bodyData: any;
  constructor(url: string, init: any) {
    this.method = init.method;
    this.bodyData = init.body;
  }
  async json() {
    return JSON.parse(this.bodyData);
  }
} as any;

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

import { POST } from './route';

// Mock Dependencies
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    paymentWebhook: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
// We will define $transaction after prisma is fully created
    $transaction: jest.fn(),
    transactionHistory: {
      create: jest.fn(),
    },
    invitation: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Now wire up $transaction to pass the prisma mock itself
(prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(prisma));

jest.mock('../../../../lib/email', () => ({
  sendInvoiceEmail: jest.fn().mockResolvedValue(true),
}));

describe('Midtrans Webhook POST API', () => {
  const SERVER_KEY = 'SB-Mid-server-sandboxkey';
  
  beforeAll(() => {
    process.env.MIDTRANS_SERVER_KEY = SERVER_KEY;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createMockRequest(body: any) {
    return new Request('https://sahinaja.com/api/webhook/midtrans', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  function generateSignature(orderId: string, statusCode: string, grossAmount: string) {
    return crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
      .digest('hex');
  }

  it('TC-N1: Should return 403 Invalid Signature if signature is wrong', async () => {
    const payload = {
      order_id: 'ORD-1',
      status_code: '200',
      gross_amount: '10000.00',
      signature_key: 'hacker-fake-signature',
    };

    const request = createMockRequest(payload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toBe('Invalid signature');
  });

  it('TC-E3: Should ignore duplicate webhook (Idempotency)', async () => {
    const payload: any = {
      order_id: 'ORD-2',
      status_code: '200',
      gross_amount: '10000.00',
      transaction_status: 'settlement',
      transaction_id: 'trx-123',
    };
    payload.signature_key = generateSignature(payload.order_id, payload.status_code, payload.gross_amount);

    // Mock existing webhook found
    (prisma.paymentWebhook.findUnique as jest.Mock).mockResolvedValue({
      id: 'hook-1',
      midtransNotifId: 'ORD-2:settlement:trx-123',
    });

    const request = createMockRequest(payload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.duplicate).toBe(true);
    expect(prisma.transaction.findUnique).not.toHaveBeenCalled();
  });

  it('TC-P1: Should process successful settlement and upgrade tier', async () => {
    const payload: any = {
      order_id: 'ORD-3',
      status_code: '200',
      gross_amount: '99000.00',
      transaction_status: 'settlement',
      transaction_id: 'trx-456',
      payment_type: 'gopay',
    };
    payload.signature_key = generateSignature(payload.order_id, payload.status_code, payload.gross_amount);

    // Mock no existing webhook
    (prisma.paymentWebhook.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock transaction exists and is PENDING
    (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({
      id: 'ORD-3',
      status: 'PENDING',
      type: 'INVITATION_UPGRADE',
      tier: 'PREMIUM',
      invitationId: 'inv-1',
      userId: 'usr-1',
      amount: 99000,
    });

    // Mock invitation data
    (prisma.invitation.findUnique as jest.Mock).mockResolvedValue({
      eventDate: new Date('2026-12-31T00:00:00.000Z'),
      groomName: 'Romeo',
      brideName: 'Juliet',
    });

    // Mock user
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      email: 'romeo@test.com',
    });

    const request = createMockRequest(payload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);

    // Assert transaction updated to PAID
    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 'ORD-3' },
      data: expect.objectContaining({
        status: 'PAID',
        midtransId: 'trx-456',
        paymentMethod: 'gopay',
      }),
    });

    // Assert invitation tier updated to PREMIUM
    expect(prisma.invitation.update).toHaveBeenCalledWith({
      where: { id: 'inv-1' },
      data: expect.objectContaining({
        tier: 'PREMIUM',
      }),
    });

    // Assert email sent
    expect(sendInvoiceEmail).toHaveBeenCalledWith('romeo@test.com', expect.objectContaining({
      orderId: 'ORD-3',
      planName: 'Premium Plan',
      coupleNames: 'Romeo & Juliet',
    }));
  });

  it('TC-N2: Should process expired transaction without upgrading tier', async () => {
    const payload: any = {
      order_id: 'ORD-4',
      status_code: '407',
      gross_amount: '10000.00',
      transaction_status: 'expire',
      transaction_id: 'trx-789',
    };
    payload.signature_key = generateSignature(payload.order_id, payload.status_code, payload.gross_amount);

    (prisma.paymentWebhook.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({
      id: 'ORD-4',
      status: 'PENDING',
    });

    const request = createMockRequest(payload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);

    // Transaction updated to EXPIRED
    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 'ORD-4' },
      data: expect.objectContaining({
        status: 'EXPIRED',
      }),
    });

    // Should not upgrade invitation
    expect(prisma.invitation.update).not.toHaveBeenCalled();
    // Should not send invoice email
    expect(sendInvoiceEmail).not.toHaveBeenCalled();
  });
});
