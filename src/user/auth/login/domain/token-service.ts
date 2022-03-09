import { UserEntity } from "@app/user/auth/login/domain/user-entity";

export abstract class TokenService {
  public abstract sign(user: UserEntity): Promise<string>;
}
