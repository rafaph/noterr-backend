import faker from "faker";
import sinon from "sinon";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";
import { LoginRepository } from "@app/user/login/domain/login-repository";
import { LoginUseCaseInput } from "@app/user/login/domain/ports/login-use-case-input";
import { TokenService } from "@app/user/login/domain/token-service";
import { makeUserEntity } from "@test/user/common/helpers/factories";

export const makeLoginRepository = (loginRepository: Partial<LoginRepository> = {}): LoginRepository => ({
  findByEmail: sinon.stub().resolves(makeUserEntity()),
  ...loginRepository,
});

export const makePasswordVerifier = (passwordVerifier: Partial<PasswordVerifier> = {}): PasswordVerifier => ({
  verify: sinon.stub().resolves(true),
  ...passwordVerifier,
});

export const makeTokenService = (tokenService: Partial<TokenService> = {}): TokenService => ({
  sign: sinon.stub().resolves(faker.datatype.uuid()),
  ...tokenService,
});

export const makeLoginUseCaseInput = (loginServiceInput: Partial<LoginUseCaseInput> = {}): LoginUseCaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...loginServiceInput,
});
