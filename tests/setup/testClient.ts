import { NextRequest } from 'next/server';

export type RouteHandler = (req: NextRequest, ctx?: unknown) => Promise<Response> | Response;

export const mockSessionState = {
  current: null as unknown,
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

  async get(handler: RouteHandler, url: string, params: Record<string, unknown> = {}) {
    return this.invoke(handler, url, 'GET', undefined, params);
  },

  async post(handler: RouteHandler, url: string, body?: Record<string, unknown>, params: Record<string, unknown> = {}) {
    return this.invoke(handler, url, 'POST', body, params);
  },

  async patch(handler: RouteHandler, url: string, body?: Record<string, unknown>, params: Record<string, unknown> = {}) {
    return this.invoke(handler, url, 'PATCH', body, params);
  },

  async delete(handler: RouteHandler, url: string, params: Record<string, unknown> = {}) {
    return this.invoke(handler, url, 'DELETE', undefined, params);
  },

  async invoke(handler: RouteHandler, url: string, method: string, body?: Record<string, unknown>, params: Record<string, unknown> = {}) {
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
