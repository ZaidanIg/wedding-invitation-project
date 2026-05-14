const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.southeast-2.pooler.supabase.com:5432/postgres";

// Note: Re-using the known user ID for zerreff.io@gmail.com: cmp5upg94000004la9c8aaa5e
const USER_ID = 'cmp5upg94000004la9c8aaa5e';
const INVITATION_SLUG = 'cmp1not2e0001vzwtget5kbhs';

async function linkInvitation() {
  const client = new Client({
    connectionString: "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
  });

  try {
    await client.connect();
    
    console.log(`Linking invitation ${INVITATION_SLUG} to user ${USER_ID}...`);

    const updateRes = await client.query(
      'UPDATE "Invitation" SET "userId" = $1 WHERE slug = $2 RETURNING *',
      [USER_ID, INVITATION_SLUG]
    );

    if (updateRes.rows.length > 0) {
      console.log(`Success! Invitation "${updateRes.rows[0].groomName} & ${updateRes.rows[0].brideName}" is now linked to your account.`);
    } else {
      console.error('Failed to link: Invitation not found.');
    }

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

linkInvitation();
