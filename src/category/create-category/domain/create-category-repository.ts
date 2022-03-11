import { CreateCategoryRepositoryInput } from "@app/category/create-category/domain/ports/create-category-repository-input";
import { UUID } from "@app/lib/uuid";

export abstract class CreateCategoryRepository {
  public abstract create(input: CreateCategoryRepositoryInput): Promise<void>;
  public abstract exists(userId: UUID, title: string): Promise<boolean>;
}
