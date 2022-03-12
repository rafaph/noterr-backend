import faker from "faker";
import sinon from "sinon";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserUseCaseInput } from "@app/user/create-user/domain/ports/create-user-use-case-input";

export const makeCreateUserRepository = (repository: Partial<CreateUserRepository> = {}): CreateUserRepository => {
  return {
    create: sinon.stub().resolves(),
    exists: sinon.stub().resolves(false),
    ...repository,
  };
};

export const makeCreateUserUseCaseInput = (input: Partial<CreateUserUseCaseInput> = {}): CreateUserUseCaseInput => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
  };
};
