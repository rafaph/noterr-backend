import faker from "faker";
import sinon from "sinon";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserUseCaseInput } from "@app/user/create-user/domain/ports/create-user-use-case-input";

export const makeCreateUserRepository = (repository: Partial<CreateUserRepository> = {}): CreateUserRepository => {
  return {
    create: sinon.stub().resolves(),
    exists: sinon.stub().resolves(false),
    ...repository,
  };
};

export const makePasswordHasher = (passwordHasher: Partial<PasswordHasher> = {}): PasswordHasher => {
  return {
    hash: sinon.stub().resolves(faker.internet.password()),
    ...passwordHasher,
  };
};

export const makeCreateUserUseCaseInput = (input: Partial<CreateUserUseCaseInput> = {}): CreateUserUseCaseInput => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
  };
};
