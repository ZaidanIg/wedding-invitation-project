import 'dotenv/config';
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

async function main() {
  const parameter = {
    transaction_details: {
      order_id: 'ORD-TEST-' + Date.now(),
      gross_amount: 207850,
    },
    credit_card: { secure: true },
    customer_details: { first_name: 'User', email: '' },
    item_details: [
      { id: 'ULTIMATE', price: 185000, quantity: 1, name: 'Ultimate Upgrade' },
      { id: 'PPN_11', price: 20350, quantity: 1, name: 'PPN' },
      { id: 'ADMIN_FEE', price: 2500, quantity: 1, name: 'Admin' }
    ]
  };

  try {
    const res = await snap.createTransaction(parameter);
    console.log("Success:", res);
  } catch (err) {
    console.error("Error from Midtrans:", err.message);
  }
}
main();
