/**
 * Custom Error Codes for the application
 */
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED', // 401: Not authenticated
  FORBIDDEN = 'FORBIDDEN',      // 403: Authenticated but no permission
  NOT_FOUND = 'NOT_FOUND',      // 404: Resource not found
  BAD_REQUEST = 'BAD_REQUEST',  // 400: Invalid input
  INTERNAL_ERROR = 'INTERNAL_ERROR', // 500: Server error
}

/**
 * Custom AppError class to handle application-specific errors
 */
export class AppError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
    
    // Ensure the prototype is set correctly (needed for instanceof checks in some environments)
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Helper to create a Forbidden error (Permission Denied)
   */
  static forbidden(message: string = "You do not have permission to perform this action.") {
    return new AppError(ErrorCode.FORBIDDEN, message);
  }

  /**
   * Helper to create an Unauthorized error (Not Logged In)
   */
  static unauthorized(message: string = "You must be logged in to access this resource.") {
    return new AppError(ErrorCode.UNAUTHORIZED, message);
  }

  /**
   * Helper to create a Not Found error
   */
  static notFound(message: string = "The requested resource was not found.") {
    return new AppError(ErrorCode.NOT_FOUND, message);
  }

  /**
   * Helper to create a Bad Request error
   */
  static badRequest(message: string) {
    return new AppError(ErrorCode.BAD_REQUEST, message);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if an error is an AppError with a specific code
 */
export function isAppErrorCode(error: unknown, code: ErrorCode): boolean {
  return isAppError(error) && error.code === code;
}
