import { UserEntity } from "@app/user/common/domain/user-entity";

export abstract class LoginRepository {
  public abstract findByEmail(email: string): Promise<UserEntity | null>;
}
