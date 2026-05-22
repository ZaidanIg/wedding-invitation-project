import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error - node types don't exactly match web types for TextDecoder
global.TextDecoder = TextDecoder;

// We must clear mocks after every test to ensure strict isolation
afterEach(() => {
  jest.clearAllMocks();
});
