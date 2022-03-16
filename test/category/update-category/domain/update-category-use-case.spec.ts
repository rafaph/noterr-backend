import sinon from "sinon";
import { CategoryAlreadyExistsError, CategoryNotFound } from "@app/category/update-category/domain/errors";
import { UpdateCategoryRepository } from "@app/category/update-category/domain/update-category-repository";
import { UpdateCategoryUseCase } from "@app/category/update-category/domain/update-category-use-case";
import {
  makeUpdateCategoryRepository,
  makeUpdateCategoryUseCaseInput,
} from "@test/category/update-category/helpers/factories";

interface Sut {
  readonly repository: UpdateCategoryRepository;
  readonly useCase: UpdateCategoryUseCase;
}

const makeSut = (repository = makeUpdateCategoryRepository()): Sut => ({
  repository,
  useCase: new UpdateCategoryUseCase(repository),
});

describe("UpdateCategoryUseCase", () => {
  it("should return a DefaultError if a category does not exist", async () => {
    const repository = makeUpdateCategoryRepository({
      exists: sinon.stub().resolves(false),
    });
    const { useCase } = makeSut(repository);
    const input = makeUpdateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.deep.equals(CategoryNotFound);
  });

  it("should return a DefaultError if a cannot update a category", async () => {
    const repository = makeUpdateCategoryRepository({
      canUpdate: sinon.stub().resolves(false),
    });
    const { useCase } = makeSut(repository);
    const input = makeUpdateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.deep.equals(CategoryAlreadyExistsError);
  });

  it("should return undefined if a category is updated", async () => {
    const { useCase } = makeSut();
    const input = makeUpdateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.undefined;
  });
});
