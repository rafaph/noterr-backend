import faker from "faker";
import sinon from "sinon";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryUseCaseInput } from "@app/category/create-category/domain/ports/create-category-use-case-input";
import { UUID } from "@app/lib/uuid";

export const makeCreateCategoryRepository = (
  repository: Partial<CreateCategoryRepository> = {},
): CreateCategoryRepository => ({
  create: sinon.stub().resolves(),
  exists: sinon.stub().resolves(false),
  ...repository,
});

export const makeCreateCategoryUseCaseInput = (
  input: Partial<CreateCategoryUseCaseInput> = {},
): CreateCategoryUseCaseInput => ({
  userId: UUID.new(),
  title: faker.name.title(),
  ...input,
});
