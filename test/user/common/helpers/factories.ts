import faker from "faker";
import { Interface } from "@app/lib/typescript/interface";
import { UUID } from "@app/lib/uuid";
import { UserEntity } from "@app/user/common/domain/user-entity";

export const makeUserEntity = (user: Partial<Interface<UserEntity>> = {}): UserEntity => {
  const userData = {
    id: UUID.new(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...user,
  };

  return new UserEntity(userData.id, userData.email, userData.password);
};
