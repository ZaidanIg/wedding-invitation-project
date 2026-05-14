const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function listUserInvitations() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    const email = 'zerreff.io@gmail.com';
    
    // Find user
    const userRes = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    const userId = userRes.rows[0].id;
    console.log(`Found User ID: ${userId} for email: ${email}`);

    // List invitations
    const invRes = await client.query('SELECT id, "groomName", "brideName", slug, "createdAt" FROM "Invitation" WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);

    console.log(`\nFound ${invRes.rows.length} invitation(s):`);
    invRes.rows.forEach((inv, index) => {
      console.log(`${index + 1}. ${inv.groomName} & ${inv.brideName} (Slug: ${inv.slug}, ID: ${inv.id})`);
    });

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

listUserInvitations();
