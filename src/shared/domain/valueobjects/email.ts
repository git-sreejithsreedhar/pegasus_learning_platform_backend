export class Email {
  constructor(public readonly email: string) {
    this.validate(email);
  }

  static create(email: string): Email {
    return new Email(email.trim().toLowerCase());
  }

  private validate(email: string): void {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  get value(): string {
    return this.email;
  }

  equals(other: Email): boolean {
    return this.email === other.email;
  }
}
