export class DateRange {
  constructor(
    private readonly start: Date,
    private readonly end: Date,
  ) {
    this.validate(start, end);
  }

  static create(date1: Date, date2: Date): DateRange {
    return new DateRange(date1, date2);
  }

  private validate(start: Date, end: Date): void {
    if (start >= end) {
      throw new Error('Start date must be before end date.');
    }
  }

  get durationDays(): number {
    return (this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24);
  }
}
