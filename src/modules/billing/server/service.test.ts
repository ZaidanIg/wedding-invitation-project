import { billingService } from './service';
import { billingRepository } from './repository';
import { ValidationError, NotFoundError, ConflictError } from '../../../lib/errors';

// Mock midtrans-client
jest.mock('midtrans-client', () => {
  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: jest.fn().mockResolvedValue({
        token: 'snap-token-123',
        redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
      }),
      transaction: {
        status: jest.fn(),
      },
    })),
  };
});

// Mock billingRepository
jest.mock('./repository', () => ({
  billingRepository: {
    findInvitationForCheckout: jest.fn(),
    findLatestTransactionByBaseIdempotencyKey: jest.fn(),
    countTransactionsByBaseIdempotencyKey: jest.fn(),
    createTransaction: jest.fn(),
    updateTransaction: jest.fn(),
  },
}));

// Mock prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    transaction: {
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb({
      transaction: { updateMany: jest.fn(), update: jest.fn() },
      transactionHistory: { createMany: jest.fn(), create: jest.fn() },
      invitation: { update: jest.fn() },
    })),
  },
}));

describe('Billing Service - createCheckout', () => {
  const user = { id: 'usr-1', name: 'Test User', email: 'test@mail.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ValidationError if plan is invalid', async () => {
    // Arrange
    const payload = { plan: 'UNKNOWN_PLAN', invitationId: 'inv-1' };

    // Act & Assert
    await expect(billingService.createCheckout(payload, user)).rejects.toThrow(ValidationError);
  });

  it('should return existing PENDING transaction if same intent exists', async () => {
    // Arrange
    const payload = { plan: 'PREMIUM', invitationId: 'inv-1' };
    (billingRepository.findInvitationForCheckout as jest.Mock).mockResolvedValue({
      userId: user.id,
      tier: 'BASIC',
    });
    
    (billingRepository.findLatestTransactionByBaseIdempotencyKey as jest.Mock).mockResolvedValue({
      id: 'ORD-123',
      status: 'PENDING',
      paymentUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-existing',
    });

    // Act
    const result = await billingService.createCheckout(payload, user);

    // Assert
    expect(result.token).toBe('snap-token-existing');
    expect(result.orderId).toBe('ORD-123');
    expect(billingRepository.createTransaction).not.toHaveBeenCalled();
  });

  it('should create new transaction with appended idempotency key if existing tx is EXPIRED (retry)', async () => {
    // Arrange
    const payload = { plan: 'PREMIUM', invitationId: 'inv-1' };
    (billingRepository.findInvitationForCheckout as jest.Mock).mockResolvedValue({
      userId: user.id,
      tier: 'BASIC',
    });

    (billingRepository.findLatestTransactionByBaseIdempotencyKey as jest.Mock).mockResolvedValue({
      id: 'ORD-OLD',
      status: 'EXPIRED', // Not PENDING
      paymentUrl: '...',
    });

    (billingRepository.countTransactionsByBaseIdempotencyKey as jest.Mock).mockResolvedValue(1);

    (billingRepository.createTransaction as jest.Mock).mockResolvedValue({
      id: 'ORD-NEW',
      status: 'PENDING',
    });

    // Act
    const result = await billingService.createCheckout(payload, user);

    // Assert
    expect(result.token).toBe('snap-token-123');
    expect(billingRepository.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: expect.stringMatching(/-1$/), // Appends -1 because count is 1
      })
    );
  });

  it('should create a new transaction on happy path', async () => {
    // Arrange
    const payload = { plan: 'PREMIUM', invitationId: 'inv-1' };
    (billingRepository.findInvitationForCheckout as jest.Mock).mockResolvedValue({
      userId: user.id,
      tier: 'BASIC',
    });

    (billingRepository.findLatestTransactionByBaseIdempotencyKey as jest.Mock).mockResolvedValue(null);
    (billingRepository.countTransactionsByBaseIdempotencyKey as jest.Mock).mockResolvedValue(0);
    (billingRepository.createTransaction as jest.Mock).mockResolvedValue({
      id: 'ORD-NEW-123',
      status: 'PENDING',
    });

    // Act
    const result = await billingService.createCheckout(payload, user);

    // Assert
    expect(result.token).toBe('snap-token-123');
    expect(billingRepository.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        invitationId: 'inv-1',
        tier: 'PREMIUM',
        status: 'PENDING',
      })
    );
    expect(billingRepository.updateTransaction).toHaveBeenCalledWith('ORD-NEW-123', {
      paymentUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
    });
  });

});
