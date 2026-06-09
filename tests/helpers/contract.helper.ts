import { expect } from '@jest/globals';

expect.extend({
  toMatchApiContract(received: Record<string, unknown>) {
    const pass = 
      received &&
      typeof received.success === 'boolean' &&
      typeof received.statusCode === 'number' &&
      typeof received.requestId === 'string' &&
      typeof received.message === 'string' &&
      typeof received.timestamp === 'string';

    if (pass) {
      return {
        message: () => `expected response not to match API V2 contract`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to match API V2 contract.
        Expected: { success: boolean, statusCode: number, requestId: string, message: string, timestamp: string }
        Received: ${JSON.stringify(received, null, 2)}`,
        pass: false,
      };
    }
  },
});

// Extend Jest types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchApiContract(): R;
    }
  }
}
