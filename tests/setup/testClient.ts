import { NextRequest } from 'next/server';

export const mockSessionState = {
  current: null as any,
};

/**
 * Supertest-like client for Next.js Route Handlers (Direct Invocation)
 * Usage:
 * const res = await testClient.asUser(user.id).post(POST, 'http://localhost/api/v2/invitations', payload);
 */
export const testClient = {
  asGuest() {
    mockSessionState.current = null;
    return this;
  },

  asUser(id: string = 'user-1', email: string = 'user@example.com') {
    mockSessionState.current = { user: { id, email, role: 'USER' } };
    return this;
  },

  asAdmin(id: string = 'admin-1', email: string = 'admin@example.com') {
    mockSessionState.current = { user: { id, email, role: 'ADMIN' } };
    return this;
  },

  getSession() {
    return mockSessionState.current;
  },

  async get(handler: (...args: any[]) => any, url: string, params: any = {}) {
    return this.invoke(handler, url, 'GET', undefined, params);
  },

  async post(handler: (...args: any[]) => any, url: string, body?: any, params: any = {}) {
    return this.invoke(handler, url, 'POST', body, params);
  },

  async patch(handler: (...args: any[]) => any, url: string, body?: any, params: any = {}) {
    return this.invoke(handler, url, 'PATCH', body, params);
  },

  async delete(handler: (...args: any[]) => any, url: string, params: any = {}) {
    return this.invoke(handler, url, 'DELETE', undefined, params);
  },

  async invoke(handler: (...args: any[]) => any, url: string, method: string, body?: any, params: any = {}) {
    const req = new NextRequest(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await handler(req, { params });
    const json = await response.json().catch(() => null);

    return {
      status: response.status,
      body: json,
      headers: response.headers,
    };
  },
};
