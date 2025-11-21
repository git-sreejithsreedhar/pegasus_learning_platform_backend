export class Password {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  static create(password: string): Password {
    return new Password(password);
  }

  private validate(password: string): void {
    if (password.length < 6) {
      throw new Error('Password length must be 6 characters');
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!hasLowercase) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!hasSpecialChar) {
      throw new Error('Password must contain at least one lowercase letter');
    }
  }

  get stringValue(): string {
    return this.value;
  }
}
