export class Money {
  constructor(private readonly value: number) {
    this.validate(value);
  }

  static create(amount: number): Money {
    return new Money(amount);
  }

  private validate(amount: number): void {
    if (amount < 0) {
      throw new Error('Amount must be Positive');
    }
  }
}
