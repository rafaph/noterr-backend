import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { Interface } from "@app/lib/ts/interface";

export type CreateCategoryUseCaseInput = Omit<Interface<CategoryEntity>, "id">;
