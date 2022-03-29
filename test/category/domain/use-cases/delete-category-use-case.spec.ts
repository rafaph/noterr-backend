import sinon from "sinon";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { DeleteCategoryUseCase } from "@app/category/domain/use-cases/delete-category-use-case";
import { makeCategoryRepository, makeDeleteCategoryUseCaseInput } from "@test/category/helpers/factories";

interface Sut {
  readonly repository: CategoryRepository;
  readonly useCase: DeleteCategoryUseCase;
}

const makeSut = (repository = makeCategoryRepository()): Sut => ({
  repository,
  useCase: new DeleteCategoryUseCase(repository),
});

describe("DeleteCategoryUseCase", () => {
  it("should return a DefaultError if a category is not found", async () => {
    const repository = makeCategoryRepository({
      findOne: sinon.stub().resolves(),
    });
    const { useCase } = makeSut(repository);
    const input = makeDeleteCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });

  it("should return a void if a category is deleted", async () => {
    const { useCase } = makeSut();
    const input = makeDeleteCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.undefined;
  });
});
