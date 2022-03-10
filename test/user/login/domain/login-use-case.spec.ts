import faker from "faker";
import sinon from "sinon";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";
import { LoginRepository } from "@app/user/login/domain/login-repository";
import { LoginUseCase } from "@app/user/login/domain/login-use-case";
import { TokenService } from "@app/user/login/domain/token-service";
import {
  makeLoginRepository,
  makeLoginUseCaseInput,
  makePasswordVerifier,
  makeTokenService,
} from "@test/user/login/helpers/factories";

interface Sut {
  readonly loginRepository: LoginRepository;
  readonly passwordVerifier: PasswordVerifier;
  readonly tokenService: TokenService;
  readonly loginUseCase: LoginUseCase;
}

type SutDependencies = Omit<Sut, "loginUseCase">;

const makeSut = (dependencies: Partial<SutDependencies> = {}): Sut => {
  const realDependencies = {
    loginRepository: makeLoginRepository(),
    passwordVerifier: makePasswordVerifier(),
    tokenService: makeTokenService(),
    ...dependencies,
  };

  return {
    loginUseCase: new LoginUseCase(
      realDependencies.loginRepository,
      realDependencies.passwordVerifier,
      realDependencies.tokenService,
    ),
    ...realDependencies,
  };
};

describe("LoginUseCase", () => {
  it("should return access token string if credentials is valid", async () => {
    const accessToken = faker.datatype.uuid();
    const { loginUseCase } = makeSut({
      tokenService: {
        sign: sinon.stub().resolves(accessToken),
      },
    });
    const result = await loginUseCase.execute(makeLoginUseCaseInput());

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.equals(accessToken);
  });

  it("should return a default error if user not found by email", async () => {
    const { loginUseCase } = makeSut({
      loginRepository: {
        findByEmail: sinon.stub().resolves(null),
      },
    });
    const result = await loginUseCase.execute(makeLoginUseCaseInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });

  it("should return a default error if user password is wrong", async () => {
    const { loginUseCase } = makeSut({
      passwordVerifier: {
        verify: sinon.stub().resolves(false),
      },
    });
    const result = await loginUseCase.execute(makeLoginUseCaseInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });
});
