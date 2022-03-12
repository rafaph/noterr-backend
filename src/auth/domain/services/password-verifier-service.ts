export abstract class PasswordVerifierService {
  public abstract verify(hash: string, password: string): Promise<boolean>;
}
