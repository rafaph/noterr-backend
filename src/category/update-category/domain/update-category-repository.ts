import { UpdateCategoryRepositoryInput } from "@app/category/update-category/domain/ports/update-category-repository-input";

export abstract class UpdateCategoryRepository {
  public abstract exists(input: UpdateCategoryRepositoryInput): Promise<boolean>;
  public abstract canUpdate(input: UpdateCategoryRepositoryInput): Promise<boolean>;
  public abstract update(input: UpdateCategoryRepositoryInput): Promise<void>;
}
