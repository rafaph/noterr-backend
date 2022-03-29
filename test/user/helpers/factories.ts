import faker from "@faker-js/faker";
import sinon from "sinon";
import { Argon2PasswordHasherService } from "@app/auth/application/services/argon2-password-hasher-service";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { Interface } from "@app/lib/ts/interface";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { CreateUserUseCaseInput } from "@app/user/domain/ports/create-user-use-case-input";
import { CreateUserRepository } from "@app/user/domain/repositories/create-user-repository";
import { makeUserEntity } from "@test/auth/helpers/factories";

export const makeDatabaseUser = async (
  prisma: PrismaService,
  userEntity: Partial<Interface<UserEntity>> = {},
): Promise<UserEntity> => {
  const user = makeUserEntity(userEntity);

  await prisma.user.create({
    data: {
      id: user.id.toString(),
      email: user.email,
      password: await new Argon2PasswordHasherService().hash(user.password),
    },
  });

  return user;
};

export const makeCreateUserRepository = (repository: Partial<CreateUserRepository> = {}): CreateUserRepository => ({
  create: sinon.stub().resolves(),
  exists: sinon.stub().resolves(false),
  ...repository,
});

export const makeCreateUserUseCaseInput = (input: Partial<CreateUserUseCaseInput> = {}): CreateUserUseCaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...input,
});
