import { UserData } from "@app/auth/domain/user-data";

export abstract class LoginRepository {
  public abstract findByEmail(email: string): Promise<UserData | null>;
}
