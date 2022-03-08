import faker from "faker";
import sinon from "sinon";
import { UUID } from "@app/lib/uuid";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserService } from "@app/user/create-user/domain/create-user-service";
import { CreateUserServiceInput } from "@app/user/create-user/domain/create-user-service-input";

interface Sut {
  readonly service: CreateUserService;
  readonly repository: CreateUserRepository;
  readonly hasher: PasswordHasher;
}

const makeRepository = (repository: Partial<CreateUserRepository> = {}): CreateUserRepository => {
  return {
    create: sinon.stub().resolves(),
    exists: sinon.stub().resolves(false),
    ...repository,
  };
};

const makePasswordHasher = (passwordHasher: Partial<PasswordHasher> = {}): PasswordHasher => {
  return {
    hash: sinon.stub().resolves(faker.internet.password()),
    ...passwordHasher,
  };
};

const makeSut = (createUserRepository?: CreateUserRepository, passwordHasher?: PasswordHasher): Sut => {
  const repository = createUserRepository ?? makeRepository();
  const hasher = passwordHasher ?? makePasswordHasher();

  return {
    service: new CreateUserService(repository, hasher),
    repository,
    hasher,
  };
};

const makeInput = (input: Partial<CreateUserServiceInput> = {}): CreateUserServiceInput => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
  };
};

describe("CreateUserService", () => {
  it("should return a valid uuid", async () => {
    const { service, repository, hasher } = makeSut();
    const input = makeInput();

    const result = await service.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.instanceof(UUID);
    expect(repository.create).to.have.been.calledWithMatch({ email: input.email });
    expect(hasher.hash).to.have.been.calledOnceWithExactly(input.password);
  });

  it("should call only repository exists method", async () => {
    const repository = makeRepository({
      exists: sinon.stub().resolves(true),
    });
    const { service } = makeSut(repository);
    const input = makeInput();

    const result = await service.execute(input);

    expect(repository.exists).to.have.been.calledOnceWithExactly(input.email);
    expect(repository.create).to.not.been.called;
    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.property("message");
  });
});
