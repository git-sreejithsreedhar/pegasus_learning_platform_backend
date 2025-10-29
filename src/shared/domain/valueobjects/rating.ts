export class Rating {
  constructor(value: number) {
    this.validate(value);
  }

  static create(rating: number) {
    return new Rating(rating);
  }

  private validate(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
  }
}
