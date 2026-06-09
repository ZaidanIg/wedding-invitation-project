// ============================================================
// Custom Error Classes
// ============================================================

import { ErrorDetail } from './api-response';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  public readonly details?: ErrorDetail[];

  constructor(message = 'Validation failed', details?: ErrorDetail[]) {
    super(message, 422, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Handle errors thrown by service layer in route handlers.
 * Returns a properly formatted error payload for errorResponse or validationErrorResponse.
 */
export function handleServiceError(error: unknown) {
  if (error instanceof ValidationError && error.details) {
    return { isValidation: true, details: error.details, message: error.message };
  }
  
  if (error instanceof AppError) {
    return { message: error.message, status: error.statusCode, code: error.code };
  }

  console.error('[Unhandled Error]:', error);
  return { message: 'An unexpected error occurred', status: 500, code: 'INTERNAL_ERROR' };
}
