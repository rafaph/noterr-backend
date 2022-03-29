import sinon from "sinon";
import { CategoryAlreadyExistsError, CategoryNotFound } from "@app/category/domain/errors";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { UpdateCategoryUseCase } from "@app/category/domain/use-cases/update-category-use-case";
import {
  makeCategoryEntity,
  makeCategoryRepository,
  makeUpdateCategoryUseCaseInput,
} from "@test/category/helpers/factories";

interface Sut {
  readonly repository: CategoryRepository;
  readonly useCase: UpdateCategoryUseCase;
}

const makeSut = (
  repository = makeCategoryRepository({
    findOne: sinon.stub().onFirstCall().resolves(makeCategoryEntity()).onSecondCall().resolves(),
  }),
): Sut => ({
  repository,
  useCase: new UpdateCategoryUseCase(repository),
});

describe("UpdateCategoryUseCase", () => {
  it("should return a DefaultError if a category does not exist", async () => {
    const repository = makeCategoryRepository({
      findOne: sinon.stub().resolves(),
    });
    const { useCase } = makeSut(repository);
    const input = makeUpdateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.be.deep.equals(CategoryNotFound);
  });

  it("should return a DefaultError if a cannot update a category", async () => {
    const repository = makeCategoryRepository({
      findOne: sinon.stub().onFirstCall().resolves(makeCategoryEntity()).onSecondCall().resolves(makeCategoryEntity()),
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
