import sinon from "sinon";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { CreateCategoryUseCase } from "@app/category/domain/use-cases/create-category-use-case";
import { UUID } from "@app/lib/uuid";
import { makeCategoryRepository, makeCreateCategoryUseCaseInput } from "@test/category/helpers/factories";

interface Sut {
  readonly repository: CategoryRepository;
  readonly useCase: CreateCategoryUseCase;
}

const makeSut = (
  repository = makeCategoryRepository({
    findOne: sinon.stub().resolves(),
  }),
): Sut => ({
  useCase: new CreateCategoryUseCase(repository),
  repository: repository,
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
    const { useCase } = makeSut(makeCategoryRepository());
    const input = makeCreateCategoryUseCaseInput();

    const result = await useCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });
});
