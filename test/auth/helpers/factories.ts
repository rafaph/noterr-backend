import faker from "@faker-js/faker";
import sinon from "sinon";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { LoginUseCaseInput } from "@app/auth/domain/ports/login-use-case-input";
import { TokenPayload } from "@app/auth/domain/ports/token-payload";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";
import { PasswordVerifierService } from "@app/auth/domain/services/password-verifier-service";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { right } from "@app/lib/ts/either";
import { UUID } from "@app/lib/uuid";

export const makePasswordHasherService = (
  passwordHasher: Partial<PasswordHasherService> = {},
): PasswordHasherService => ({
  hash: sinon.stub().resolves(faker.internet.password()),
  ...passwordHasher,
});

export const makePasswordVerifierService = (
  passwordVerifier: Partial<PasswordVerifierService> = {},
): PasswordVerifierService => ({
  verify: sinon.stub().resolves(true),
  ...passwordVerifier,
});

export const makeTokenExtractorService = (
  tokenExtractor: Partial<TokenExtractorService> = {},
): TokenExtractorService => ({
  extract: sinon.stub().returns(right(faker.datatype.uuid())),
  ...tokenExtractor,
});

export const makeTokenSignerService = (tokenSigner: Partial<TokenSignerService> = {}): TokenSignerService => ({
  sign: sinon.stub().resolves(faker.datatype.uuid()),
  ...tokenSigner,
});

export const makeTokenPayload = (tokenPayload: Partial<TokenPayload> = {}): TokenPayload => ({
  userId: faker.datatype.uuid(),
  ...tokenPayload,
});

export const makeTokenVerifierService = (tokenVerifier: Partial<TokenVerifierService> = {}): TokenVerifierService => ({
  verify: sinon.stub().resolves(right(makeTokenPayload())),
  ...tokenVerifier,
});

export const makeIsAuthenticatedRepository = (
  repository: Partial<IsAuthenticatedRepository> = {},
): IsAuthenticatedRepository => ({
  exists: sinon.stub().resolves(true),
  ...repository,
});

export const makeUserEntity = (userEntity: Partial<UserEntity> = {}): UserEntity => {
  const data = {
    id: UUID.new(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...userEntity,
  };

  return new UserEntity(data.id, data.email, data.password);
};

export const makeLoginRepository = (repository: Partial<LoginRepository> = {}): LoginRepository => ({
  findByEmail: sinon.stub().resolves(makeUserEntity()),
  ...repository,
});

export const makeLoginUseCaseInput = (input: Partial<LoginUseCaseInput> = {}): LoginUseCaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...input,
});
