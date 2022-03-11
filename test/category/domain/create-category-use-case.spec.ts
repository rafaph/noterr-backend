import sinon from "sinon";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryUseCase } from "@app/category/create-category/domain/create-category-use-case";
import { UUID } from "@app/lib/uuid";
import { makeCreateCategoryRepository, makeCreateCategoryUseCaseInput } from "@test/category/helpers/factories";

interface Sut {
  readonly createCategoryRepository: CreateCategoryRepository;
  readonly createCategoryUseCase: CreateCategoryUseCase;
}

const makeSut = (createCategoryRepository = makeCreateCategoryRepository()): Sut => ({
  createCategoryUseCase: new CreateCategoryUseCase(createCategoryRepository),
  createCategoryRepository,
});

describe("CreateCategoryUseCase", () => {
  it("should return category id on success creation", async () => {
    const { createCategoryUseCase } = makeSut();
    const input = makeCreateCategoryUseCaseInput();

    const result = await createCategoryUseCase.execute(input);

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.a.instanceOf(UUID);
  });

  it("should return a DefaultError if category already exists", async () => {
    const { createCategoryUseCase } = makeSut(
      makeCreateCategoryRepository({
        exists: sinon.stub().resolves(true),
      }),
    );
    const input = makeCreateCategoryUseCaseInput();

    const result = await createCategoryUseCase.execute(input);

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });
});
