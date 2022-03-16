import faker from "faker";
import sinon from "sinon";
import { CreateCategoryRepositoryInput } from "@app/category/create-category/domain/ports/create-category-repository-input";
import { UpdateCategoryUseCaseInput } from "@app/category/update-category/domain/ports/update-category-use-case-input";
import { UpdateCategoryRepository } from "@app/category/update-category/domain/update-category-repository";
import { UUID } from "@app/lib/uuid";

export const makeUpdateCategoryRepository = (
  repository: Partial<UpdateCategoryRepository> = {},
): UpdateCategoryRepository => ({
  exists: sinon.stub().resolves(true),
  canUpdate: sinon.stub().resolves(true),
  update: sinon.stub().resolves(),
  ...repository,
});

export const makeUpdateCategoryUseCaseInput = (
  input: Partial<UpdateCategoryUseCaseInput> = {},
): UpdateCategoryUseCaseInput => ({
  id: UUID.new(),
  userId: UUID.new(),
  title: faker.name.title(),
  ...input,
});

export const makeCreateCategoryRepositoryInput = (
  input: Partial<CreateCategoryRepositoryInput> = {},
): CreateCategoryRepositoryInput => ({
  id: UUID.new(),
  userId: UUID.new(),
  title: faker.name.title(),
  ...input,
});
