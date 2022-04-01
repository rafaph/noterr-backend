import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { ListCategoryUseCase } from "@app/category/domain/use-cases/list-category-use-case";
import { makeCategoryRepository, makeListCategoryUseCaseInput } from "@test/category/helpers/factories";

interface Sut {
  readonly repository: CategoryRepository;
  readonly useCase: ListCategoryUseCase;
}

const makeSut = (repository = makeCategoryRepository()): Sut => ({
  repository,
  useCase: new ListCategoryUseCase(repository),
});

describe("ListCategoryUseCase", () => {
  it("should return a list of categories", async () => {
    const { useCase } = makeSut();
    const input = makeListCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result).to.be.an.array();
    expect(result[0]).to.be.an.instanceOf(CategoryEntity);
  });
});
