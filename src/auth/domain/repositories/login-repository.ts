import { UserEntity } from "@app/auth/domain/entities/user-entity";

export abstract class LoginRepository {
  public abstract findByEmail(email: string): Promise<UserEntity | null>;
}
