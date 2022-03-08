export abstract class PasswordVerifier {
  public abstract verify(hash: string, password: string): Promise<boolean>;
}
