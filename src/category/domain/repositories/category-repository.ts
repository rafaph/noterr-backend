import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { BaseRepository } from "@app/shared/domain/repositories/base-repository";

export abstract class CategoryRepository extends BaseRepository<CategoryEntity> {}
