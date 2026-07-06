export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly errors?: Record<string, string[]>; // field-level validation errors from Flask

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    errors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.errors = params.errors;
  }
}