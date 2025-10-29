export class Email {
  constructor(public readonly value: string) {
    this.validate(value);
  }

  static create(email: string): Email {
    return new Email(email);
  }

  private validate(email: string): void {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
