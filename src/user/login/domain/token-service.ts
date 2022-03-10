import { UserEntity } from "@app/user/common/domain/user-entity";

export abstract class TokenService {
  public abstract sign(user: UserEntity): Promise<string>;
}
