import { CreateCategoryRepositoryInput } from "@app/category/create-category/domain/ports/create-category-repository-input";

export type CreateCategoryUseCaseInput = Omit<CreateCategoryRepositoryInput, "id">;
