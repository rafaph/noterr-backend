import { Injectable } from "@nestjs/common";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { ListCategoryUseCaseInput } from "@app/category/domain/ports/list-category-use-case-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";

@Injectable()
export class ListCategoryUseCase {
  public constructor(private readonly categoryRepository: CategoryRepository) {}

  public execute({ userId }: ListCategoryUseCaseInput): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ userId });
  }
}
