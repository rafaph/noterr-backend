import faker from "@faker-js/faker";
import sinon from "sinon";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CreateCategoryUseCaseInput } from "@app/category/domain/ports/create-category-use-case-input";
import { DeleteCategoryUseCaseInput } from "@app/category/domain/ports/delete-category-use-case-input";
import { ListCategoryUseCaseInput } from "@app/category/domain/ports/list-category-use-case-input";
import { UpdateCategoryUseCaseInput } from "@app/category/domain/ports/update-category-use-case-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";

export const makeCategoryEntity = (entity: Partial<Interface<CategoryEntity>> = {}): CategoryEntity => {
  const values = {
    id: UUID.new(),
    userId: UUID.new(),
    title: faker.name.title(),
    ...entity,
  };

  return new CategoryEntity(values.id, values.userId, values.title);
};

export const makeCategoryRepository = (
  repository: Partial<Interface<CategoryRepository>> = {},
): CategoryRepository => ({
  create: sinon.stub().resolves(),
  update: sinon.stub().resolves(),
  delete: sinon.stub().resolves(),
  find: sinon.stub().resolves([makeCategoryEntity()]),
  findOne: sinon.stub().resolves(makeCategoryEntity()),
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

export const makeCreateCategoryUseCaseInput = (
  input: Partial<CreateCategoryUseCaseInput> = {},
): CreateCategoryUseCaseInput => ({
  userId: UUID.new(),
  title: faker.name.title(),
  ...input,
});

export const makeDeleteCategoryUseCaseInput = (
  input: Partial<DeleteCategoryUseCaseInput> = {},
): DeleteCategoryUseCaseInput => ({
  id: UUID.new(),
  userId: UUID.new(),
  ...input,
});

export const makeListCategoryUseCaseInput = (
  input: Partial<ListCategoryUseCaseInput> = {},
): ListCategoryUseCaseInput => ({
  userId: UUID.new(),
  ...input,
});
