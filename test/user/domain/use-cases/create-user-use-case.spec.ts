import sinon from "sinon";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";
import { UUID } from "@app/lib/uuid";
import { CreateUserRepository } from "@app/user/domain/repositories/create-user-repository";
import { CreateUserUseCase } from "@app/user/domain/use-cases/create-user-use-case";
import { makePasswordHasherService } from "@test/auth/helpers/factories";
import { makeCreateUserRepository, makeCreateUserUseCaseInput } from "@test/user/helpers/factories";

interface Sut {
  readonly useCase: CreateUserUseCase;
  readonly repository: CreateUserRepository;
  readonly passwordHasher: PasswordHasherService;
}

const makeSut = (
  createUserRepository = makeCreateUserRepository(),
  passwordHasher = makePasswordHasherService(),
): Sut => ({
  useCase: new CreateUserUseCase(createUserRepository, passwordHasher),
  repository: createUserRepository,
  passwordHasher,
});

describe("CreateUserUseCase", () => {
  it("should return a valid uuid", async () => {
    const { useCase, repository, passwordHasher } = makeSut();
    const input = makeCreateUserUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.instanceof(UUID);
    expect(repository.create).to.have.been.calledWithMatch({ email: input.email });
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
