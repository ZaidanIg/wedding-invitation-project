import request from 'supertest';
import { UserFactory } from '../factories/user.factory';

// Note: Integration tests with Supertest against Next.js App Router 
// generally require the Next.js dev server to be running on localhost:3000.
// We target process.env.NEXT_PUBLIC_API_URL or default to localhost:3000.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe.skip('Auth Module Integration Tests (Supertest)', () => {
  it('✓ Should complete full registration flow', async () => {
    // 1. Register a new user
    const registerPayload = {
      name: 'Integration User',
      email: `integration-${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    };

    const registerRes = await request(API_URL)
      .post('/api/auth/register')
      .send(registerPayload);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);

    // 2. Try to log in via NextAuth credentials provider
    const loginRes = await request(API_URL)
      .post('/api/auth/callback/credentials')
      .send({
        email: registerPayload.email,
        password: registerPayload.password,
        json: 'true',
      });

    // NextAuth returns 200 OK with a URL on successful login
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.url).toBeDefined();

    // The set-cookie header should contain the session token
    const cookies = loginRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const sessionCookie = cookiesArray.find((c: string) => c && (c.includes('authjs.session-token') || c.includes('next-auth.session-token')));
    expect(sessionCookie).toBeDefined();
  });

  it('✓ Should fail login with incorrect password', async () => {
    const email = `fail-${Date.now()}@example.com`;
    await UserFactory.create({ email, password: 'correct-password' });

    const loginRes = await request(API_URL)
      .post('/api/auth/callback/credentials')
      .send({
        email,
        password: 'wrong-password',
        json: 'true',
      });

    // NextAuth redirects to error page or returns 401 depending on config
    expect([401, 200]).toContain(loginRes.status);
    if (loginRes.status === 200) {
      expect(loginRes.body.url).toContain('error');
    }
  });
});
