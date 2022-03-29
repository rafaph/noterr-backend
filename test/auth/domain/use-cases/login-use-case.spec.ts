import faker from "@faker-js/faker";
import sinon from "sinon";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { PasswordVerifierService } from "@app/auth/domain/services/password-verifier-service";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { LoginUseCase } from "@app/auth/domain/use-cases/login-use-case";
import {
  makeLoginRepository,
  makeLoginUseCaseInput,
  makePasswordVerifierService,
  makeTokenSignerService,
} from "@test/auth/helpers/factories";

interface Sut {
  readonly repository: LoginRepository;
  readonly passwordVerifier: PasswordVerifierService;
  readonly tokenSigner: TokenSignerService;
  readonly useCase: LoginUseCase;
}

type SutDependencies = Omit<Sut, "useCase">;

const makeSut = (dependencies: Partial<SutDependencies> = {}): Sut => {
  const realDependencies: SutDependencies = {
    repository: makeLoginRepository(),
    passwordVerifier: makePasswordVerifierService(),
    tokenSigner: makeTokenSignerService(),
    ...dependencies,
  };

  return {
    useCase: new LoginUseCase(
      realDependencies.repository,
      realDependencies.passwordVerifier,
      realDependencies.tokenSigner,
    ),
    ...realDependencies,
  };
};

describe("LoginUseCase", () => {
  it("should return access token string if credentials is valid", async () => {
    const accessToken = faker.datatype.uuid();
    const { useCase } = makeSut({
      tokenSigner: {
        sign: sinon.stub().resolves(accessToken),
      },
    });
    const result = await useCase.execute(makeLoginUseCaseInput());

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.equals(accessToken);
  });

  it("should return a default error if user not found by email", async () => {
    const { useCase } = makeSut({
      repository: {
        findByEmail: sinon.stub().resolves(null),
      },
    });
    const result = await useCase.execute(makeLoginUseCaseInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });

  it("should return a default error if user password is wrong", async () => {
    const { useCase } = makeSut({
      passwordVerifier: {
        verify: sinon.stub().resolves(false),
      },
    });
    const result = await useCase.execute(makeLoginUseCaseInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });
});
