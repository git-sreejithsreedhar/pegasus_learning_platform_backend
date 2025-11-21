export class RefreshToken {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(userId: string, token: string, ttlDays = 7): RefreshToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ttlDays);

    return new RefreshToken(userId, token, expiresAt);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
