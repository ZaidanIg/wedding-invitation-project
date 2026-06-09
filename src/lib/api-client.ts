import { ErrorResponseBody, SuccessResponseBody } from './api-response';

/**
 * Standardized API Client Error that carries the Backend v2 Error Contract
 */
export class ApiClientError extends Error {
  public statusCode: number;
  public code: string;
  public details?: { field: string; message: string }[];
  public requestId?: string;

  constructor(errorResponse: ErrorResponseBody) {
    super(errorResponse.message || 'API request failed');
    this.name = 'ApiClientError';
    this.statusCode = errorResponse.statusCode;
    this.code = errorResponse.error.code;
    this.details = errorResponse.error.details;
    this.requestId = errorResponse.requestId;
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

/**
 * Centralized API Client for v2 Endpoints
 * Automatically parses JSON, handles standard responses, and throws structured ApiClientError on failure.
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<SuccessResponseBody<T>> {
  const { headers, body, ...restOptions } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(endpoint, {
      ...restOptions,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    // If HTTP status is not ok OR backend explicitly says success: false
    if (!response.ok || data.success === false) {
      throw new ApiClientError(data as ErrorResponseBody);
    }

    return data as SuccessResponseBody<T>;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Network errors or invalid JSON fallback
    throw new ApiClientError({
      success: false,
      statusCode: 500,
      requestId: 'client_fail',
      message: error instanceof Error ? error.message : 'Unknown network error',
      error: { code: 'NETWORK_ERROR' },
      timestamp: new Date().toISOString(),
    });
  }
}
