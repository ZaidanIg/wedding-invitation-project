import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error - node types don't exactly match web types for TextDecoder
global.TextDecoder = TextDecoder;
