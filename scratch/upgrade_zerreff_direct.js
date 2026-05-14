const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function upgradeUser() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    const email = 'zerreff.io@gmail.com';
    
    // Find user first
    const findRes = await client.query('SELECT * FROM "User" WHERE email = $1', [email]);
    
    if (findRes.rows.length === 0) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    // Update user
    const updateRes = await client.query(
      'UPDATE "User" SET "accountType" = $1 WHERE email = $2 RETURNING *',
      ['B2B_ALL_TIME', email]
    );

    console.log(`Success! User ${email} upgraded to B2B_ALL_TIME.`);
    console.log('User data:', updateRes.rows[0]);

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

upgradeUser();
