import { UserEntity } from "@app/user/auth/login/domain/user-entity";

export abstract class LoginRepository {
  public abstract findByEmail(email: string): Promise<UserEntity | null>;
}
