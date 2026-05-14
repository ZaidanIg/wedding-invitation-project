const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  const client = await pool.connect();
  try {
    const slug = 'cmp31l84n0001ytwtih708t4e';
    const res = await client.query(
      'SELECT id, slug FROM "Invitation" WHERE slug = $1',
      [slug]
    );
    console.log('Search by slug:', res.rows);
    
    const res2 = await client.query(
      'SELECT id, slug FROM "Invitation" WHERE id = $1',
      [slug]
    );
    console.log('Search by id:', res2.rows);
  } finally {
    client.release();
  }
}

main().catch(e => console.error(e)).finally(() => pool.end());
