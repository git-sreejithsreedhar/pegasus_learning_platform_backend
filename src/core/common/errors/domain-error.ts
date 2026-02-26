export abstract class DomainError extends Error {
  abstract readonly code: string;
  readonly isOperational: boolean = true;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    // Captures the stack trace while keeping this constructor out of it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
