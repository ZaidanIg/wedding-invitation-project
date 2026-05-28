import 'dotenv/config';
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

async function main() {
  const amount = 207850;
  const parameter = {
    transaction_details: {
      order_id: 'ORD-TEST-' + Date.now(),
      gross_amount: amount,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: 'Test',
      email: 'test@example.com',
    },
    item_details: [
      { id: 'ULTIMATE', price: 185000, quantity: 1, name: 'Ultimate Upgrade' },
      { id: 'PPN_11', price: Math.round(185000 * 0.11), quantity: 1, name: 'PPN / Pajak (11%)' },
      { id: 'ADMIN_FEE', price: 2500, quantity: 1, name: 'Biaya Admin & Layanan' }
    ],
    callbacks: {
      finish: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
      unfinish: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
      error: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
    },
    custom_expiry: {
      order_time: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' +0700',
      expiry_duration: 24,
      unit: 'hour',
    },
  };

  try {
    const res = await snap.createTransaction(parameter);
    console.log("Success:", res);
  } catch (err) {
    console.error("Error from Midtrans:", err.message);
    if (err.ApiResponse) console.error("API Response:", err.ApiResponse);
  }
}

main();
