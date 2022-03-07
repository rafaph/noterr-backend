export abstract class PasswordHasher {
  public abstract hash(password: string): Promise<string>;
}
