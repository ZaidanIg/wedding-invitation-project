import { NextResponse } from 'next/server';

// ============================================================
// Centralized API v2 Response Helpers
// ============================================================

export interface SuccessResponseBody<T> {
  success: true;
  statusCode: number;
  requestId: string;
  message: string;
  data: T;
  meta: Record<string, unknown> | PaginationMeta | null;
  timestamp: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponseBody {
  success: false;
  statusCode: number;
  requestId: string;
  message: string;
  error: {
    code: string;
    field?: string;
    details?: ErrorDetail[];
  };
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

function generateRequestId(): string {
  // Simple random hex string for request ID (req_xxxxxx)
  return 'req_' + Math.random().toString(16).substring(2, 10);
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200,
  headers?: Record<string, string>,
): NextResponse<SuccessResponseBody<T>> {
  const body: SuccessResponseBody<T> = {
    success: true,
    statusCode: status,
    requestId: generateRequestId(),
    message,
    data,
    meta: null,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status, headers });
}

export function paginatedResponse<T>(
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number },
  message = 'Success',
  status = 200,
): NextResponse<SuccessResponseBody<T[]>> {
  const hasNext = meta.page < meta.totalPages;
  const hasPrevious = meta.page > 1;

  const fullMeta: PaginationMeta = {
    ...meta,
    hasNext,
    hasPrevious,
    nextPage: hasNext ? meta.page + 1 : null,
    previousPage: hasPrevious ? meta.page - 1 : null,
  };

  const body: SuccessResponseBody<T[]> = {
    success: true,
    statusCode: status,
    requestId: generateRequestId(),
    message,
    data,
    meta: fullMeta,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  code = 'INTERNAL_ERROR',
  field?: string,
): NextResponse<ErrorResponseBody> {
  const body: ErrorResponseBody = {
    success: false,
    statusCode: status,
    requestId: generateRequestId(),
    message,
    error: {
      code,
      ...(field && { field }),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}

export function validationErrorResponse(
  details: ErrorDetail[],
  message = 'Validation failed',
): NextResponse<ErrorResponseBody> {
  const body: ErrorResponseBody = {
    success: false,
    statusCode: 422,
    requestId: generateRequestId(),
    message,
    error: {
      code: 'VALIDATION_ERROR',
      details,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: 422 });
}
