export class Profile {
  constructor(
    private readonly name: string,
    private readonly bio?: string,
    private readonly avatar?: string,
  ) {
    this.validate(name);
  }

  static create(name: string, bio?: string, avatar?: string): Profile {
    return new Profile(name, bio, avatar);
  }

  private validate(name: string) {
    if (!name.trim()) {
      throw new Error('Profile name cannot be empty');
    }
  }
}
