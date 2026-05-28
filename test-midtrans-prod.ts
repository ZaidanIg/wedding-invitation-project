import 'dotenv/config';
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: 'SB-Mid-server-tHrF-Bah1h572_3l_j8Eh9tJ',
  clientKey: 'SB-Mid-client-MLcN155QTV_8kYKx',
});

async function main() {
  const parameter = {
    transaction_details: {
      order_id: 'ORD-TEST-' + Date.now(),
      gross_amount: 207850,
    },
    credit_card: { secure: true }
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
