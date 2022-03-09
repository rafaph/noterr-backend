import faker from "faker";
import sinon from "sinon";
import { LoginRepository } from "@app/user/auth/login/domain/login-repository";
import { LoginService } from "@app/user/auth/login/domain/login-service";
import { LoginServiceInput } from "@app/user/auth/login/domain/ports/login-service-input";
import { TokenService } from "@app/user/auth/login/domain/token-service";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";
import { makeUserEntity } from "@test/builders/make-user-entity";

interface Sut {
  readonly loginRepository: LoginRepository;
  readonly passwordVerifier: PasswordVerifier;
  readonly tokenService: TokenService;
  readonly loginService: LoginService;
}

const makeLoginRepository = (loginRepository: Partial<LoginRepository> = {}): LoginRepository => ({
  findByEmail: sinon.stub().resolves(makeUserEntity()),
  ...loginRepository,
});

const makePasswordVerifier = (passwordVerifier: Partial<PasswordVerifier> = {}): PasswordVerifier => ({
  verify: sinon.stub().resolves(true),
  ...passwordVerifier,
});

const makeTokenService = (tokenService: Partial<TokenService> = {}): TokenService => ({
  sign: sinon.stub().resolves(faker.datatype.uuid()),
  ...tokenService,
});

const makeSut = (dependencies: Partial<Omit<Sut, "loginService">> = {}): Sut => {
  const realDependencies = {
    loginRepository: makeLoginRepository(),
    passwordVerifier: makePasswordVerifier(),
    tokenService: makeTokenService(),
    ...dependencies,
  };

  return {
    loginService: new LoginService(
      realDependencies.loginRepository,
      realDependencies.passwordVerifier,
      realDependencies.tokenService,
    ),
    ...realDependencies,
  };
};

const makeInput = (loginServiceInput: Partial<LoginServiceInput> = {}): LoginServiceInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...loginServiceInput,
});

describe("LoginService", () => {
  it("should return access token string if credentials is valid", async () => {
    const accessToken = faker.datatype.uuid();
    const { loginService } = makeSut({
      tokenService: {
        sign: sinon.stub().resolves(accessToken),
      },
    });
    const result = await loginService.execute(makeInput());

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.equals(accessToken);
  });

  it("should return a default error if user not found by email", async () => {
    const { loginService } = makeSut({
      loginRepository: {
        findByEmail: sinon.stub().resolves(null),
      },
    });
    const result = await loginService.execute(makeInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });

  it("should return a default error if user password is wrong", async () => {
    const { loginService } = makeSut({
      passwordVerifier: {
        verify: sinon.stub().resolves(false),
      },
    });
    const result = await loginService.execute(makeInput());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.have.keys(["message", "code"]);
  });
});
