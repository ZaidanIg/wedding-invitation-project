// ============================================================
// Centralized API Response Helpers
// ============================================================

import { NextResponse } from 'next/server';

interface SuccessResponseBody<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponseBody {
  success: false;
  message: string;
  error: {
    code: string;
  };
}

interface PaginatedResponseBody<T> {
  success: true;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200,
  headers?: Record<string, string>,
): NextResponse<SuccessResponseBody<T>> {
  return NextResponse.json(
    { success: true as const, message, data },
    { status, headers },
  );
}

export function errorResponse(
  message: string,
  status = 500,
  code = 'INTERNAL_ERROR',
): NextResponse<ErrorResponseBody> {
  return NextResponse.json(
    { success: false as const, message, error: { code } },
    { status },
  );
}

export function paginatedResponse<T>(
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number },
  message = 'Success',
): NextResponse<PaginatedResponseBody<T>> {
  return NextResponse.json({
    success: true as const,
    message,
    data,
    meta,
  });
}
