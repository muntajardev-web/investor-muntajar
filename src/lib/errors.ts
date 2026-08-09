export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "EXTERNAL_SERVICE"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      "NOT_FOUND",
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      404,
      { resource, id },
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super("FORBIDDEN", message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("CONFLICT", message, 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds?: number) {
    super("RATE_LIMIT", "Too many requests", 429, {
      retryAfterSeconds,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super("EXTERNAL_SERVICE", message, 502, { service });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
