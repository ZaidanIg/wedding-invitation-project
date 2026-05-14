const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  const client = await pool.connect();
  try {
    const email = 'selviagumilar@gmail.com';
    const res = await client.query(
      'UPDATE "User" SET "accountType" = $1 WHERE email = $2 RETURNING email, "accountType"',
      ['B2B_ALL_TIME', email]
    );
    if (res.rowCount > 0) {
      console.log(`Upgraded ${res.rows[0].email} to ${res.rows[0].accountType}`);
    } else {
      console.log(`User ${email} not found`);
    }
  } finally {
    client.release();
  }
}

main().catch(e => console.error(e)).finally(() => pool.end());
