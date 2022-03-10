import sinon from "sinon";
import { UUID } from "@app/lib/uuid";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserUseCase } from "@app/user/create-user/domain/create-user-use-case";
import {
  makeCreateUserRepository,
  makeCreateUserUseCaseInput,
  makePasswordHasher,
} from "@test/user/create-user/helpers/factories";

interface Sut {
  readonly useCase: CreateUserUseCase;
  readonly createUserRepository: CreateUserRepository;
  readonly passwordHasher: PasswordHasher;
}

const makeSut = (createUserRepository = makeCreateUserRepository(), passwordHasher = makePasswordHasher()): Sut => ({
  useCase: new CreateUserUseCase(createUserRepository, passwordHasher),
  createUserRepository,
  passwordHasher,
});

describe("CreateUserUseCase", () => {
  it("should return a valid uuid", async () => {
    const { useCase, createUserRepository, passwordHasher } = makeSut();
    const input = makeCreateUserUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.instanceof(UUID);
    expect(createUserRepository.create).to.have.been.calledWithMatch({ email: input.email });
    expect(passwordHasher.hash).to.have.been.calledOnceWithExactly(input.password);
  });

  it("should call only repository exists method", async () => {
    const createUserRepository = makeCreateUserRepository({
      exists: sinon.stub().resolves(true),
    });
    const { useCase } = makeSut(createUserRepository);
    const input = makeCreateUserUseCaseInput();

    const result = await useCase.execute(input);

    expect(createUserRepository.exists).to.have.been.calledOnceWithExactly(input.email);
    expect(createUserRepository.create).to.not.been.called;
    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.property("message");
  });
});
