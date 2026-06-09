import '@testing-library/jest-dom';
import { testDb } from './testDb';
import '../helpers/contract.helper';

// Load test environment variables
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Setup global mocks
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((cb) => cb),
}));

// Mock Next.js Request/Response for Route Handler tests
global.Request = class Request {
  method: string;
  url: string;
  bodyData: unknown;
  headers: Headers;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.bodyData = init?.body;
    this.headers = new Headers(init?.headers as HeadersInit);
  }
  
  async json() {
    return typeof this.bodyData === 'string' ? JSON.parse(this.bodyData) : this.bodyData;
  }
} as unknown as typeof global.Request;

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
          headers: new Headers(init?.headers),
        };
      }),
    },
    NextRequest: class NextRequest {
      method: string;
      url: string;
      nextUrl: URL;
      bodyData: unknown;
      headers: Headers;

      constructor(url: string, init?: RequestInit) {
        this.url = url;
        this.nextUrl = new URL(url);
        this.method = init?.method || 'GET';
        this.bodyData = init?.body;
        this.headers = new Headers(init?.headers as HeadersInit);
      }
      
      async json() {
        return typeof this.bodyData === 'string' ? JSON.parse(this.bodyData) : this.bodyData;
      }
    }
  };
});

// Database cleanup before each test
beforeEach(async () => {
  jest.clearAllMocks();
  // Only truncate DB in Node.js environment (Integration/API tests)
  if (typeof window === 'undefined') {
    await testDb.truncate();
  }
});

afterAll(async () => {
  if (typeof window === 'undefined') {
    await testDb.disconnect();
  }
});

// Mock NextAuth globally to use our testClient state
jest.mock('../../src/lib/auth', () => ({
  auth: jest.fn(async () => {
    // Dynamically import testClient to avoid circular dependency issues
    const { mockSessionState } = await import('./testClient');
    return mockSessionState.current;
  }),
}));
