const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, email, "accountType" FROM "User"');
    console.log(JSON.stringify(res.rows, null, 2));
  } finally {
    client.release();
  }
}

main().catch(e => console.error(e)).finally(() => pool.end());
