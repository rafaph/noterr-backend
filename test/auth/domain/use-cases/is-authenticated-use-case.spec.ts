import faker from "faker";
import sinon from "sinon";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { IsAuthenticatedUseCase } from "@app/auth/domain/use-cases/is-authenticated-use-case";
import { DefaultError } from "@app/lib/error/default-error";
import { left } from "@app/lib/ts/either";
import { UUID } from "@app/lib/uuid";
import {
  makeIsAuthenticatedRepository,
  makeTokenExtractorService,
  makeTokenVerifierService,
} from "@test/auth/helpers/factories";

interface Sut {
  readonly repository: IsAuthenticatedRepository;
  readonly tokenVerifier: TokenVerifierService;
  readonly tokenExtractor: TokenExtractorService;
  readonly useCase: IsAuthenticatedUseCase;
}

type SutDependencies = Omit<Sut, "useCase">;

const makeSut = (dependencies: Partial<SutDependencies> = {}): Sut => {
  const realDependencies: SutDependencies = {
    repository: makeIsAuthenticatedRepository(),
    tokenVerifier: makeTokenVerifierService(),
    tokenExtractor: makeTokenExtractorService(),
    ...dependencies,
  };

  return {
    useCase: new IsAuthenticatedUseCase(
      realDependencies.tokenExtractor,
      realDependencies.tokenVerifier,
      realDependencies.repository,
    ),
    ...realDependencies,
  };
};

const makeDefaultError = (error: Partial<DefaultError> = {}): DefaultError => ({
  message: faker.lorem.sentence(),
  code: faker.name.title().replaceAll(" ", "_").toUpperCase(),
  ...error,
});

describe("IsAuthenticatedUseCase", () => {
  it("should return a DefaultError if token could not be extracted", async () => {
    const tokenExtractor = makeTokenExtractorService({
      extract: sinon.stub().returns(left(makeDefaultError())),
    });
    const { useCase } = makeSut({ tokenExtractor });

    const result = await useCase.execute({});

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
    expect(tokenExtractor.extract).to.have.been.calledOnce;
  });

  it("should return a DefaultError if token could not be verified", async () => {
    const tokenVerifier = makeTokenVerifierService({
      verify: sinon.stub().resolves(left(makeDefaultError())),
    });
    const { useCase } = makeSut({ tokenVerifier });

    const result = await useCase.execute({});

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
    expect(tokenVerifier.verify).to.have.been.calledOnce;
  });

  it("should return a DefaultError if userId in token payload is not valid", async () => {
    const repository = makeIsAuthenticatedRepository({
      exists: sinon.stub().resolves(false),
    });
    const { useCase } = makeSut({ repository });

    const result = await useCase.execute({});

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
    expect(repository.exists).to.have.been.calledOnce;
  });

  it("should return the user UUID present in authorization header", async () => {
    const { useCase } = makeSut();
    const result = await useCase.execute({});

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.a.instanceOf(UUID);
  });
});
