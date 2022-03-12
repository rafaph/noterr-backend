import sinon from "sinon";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryUseCase } from "@app/category/create-category/domain/create-category-use-case";
import { UUID } from "@app/lib/uuid";
import {
  makeCreateCategoryRepository,
  makeCreateCategoryUseCaseInput,
} from "@test/category/create-category/helpers/factories";

interface Sut {
  readonly repository: CreateCategoryRepository;
  readonly useCase: CreateCategoryUseCase;
}

const makeSut = (createCategoryRepository = makeCreateCategoryRepository()): Sut => ({
  useCase: new CreateCategoryUseCase(createCategoryRepository),
  repository: createCategoryRepository,
});

describe("CreateCategoryUseCase", () => {
  it("should return category id on success creation", async () => {
    const { useCase } = makeSut();
    const input = makeCreateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.a.instanceOf(UUID);
  });

  it("should return a DefaultError if category already exists", async () => {
    const { useCase } = makeSut(
      makeCreateCategoryRepository({
        exists: sinon.stub().resolves(true),
      }),
    );
    const input = makeCreateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });
});
