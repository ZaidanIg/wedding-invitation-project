const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.oicflzdqproexzhhpydu:Asgardian%4013@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function listOrphanInvitations() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    // List invitations without userId
    const invRes = await client.query('SELECT id, "groomName", "brideName", slug, "createdAt" FROM "Invitation" WHERE "userId" IS NULL ORDER BY "createdAt" DESC LIMIT 20');

    console.log(`\nFound ${invRes.rows.length} orphan invitation(s) (no user):`);
    invRes.rows.forEach((inv, index) => {
      console.log(`${index + 1}. ${inv.groomName} & ${inv.brideName} (Slug: ${inv.slug}, ID: ${inv.id}, Created: ${inv.createdAt})`);
    });

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

listOrphanInvitations();
