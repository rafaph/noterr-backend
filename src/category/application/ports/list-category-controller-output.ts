import { ApiResponseProperty } from "@nestjs/swagger";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";

export class ListCategoryControllerOutput {
  @ApiResponseProperty()
  public readonly id!: string;

  @ApiResponseProperty()
  public readonly title!: string;

  public constructor(category: CategoryEntity) {
    this.id = category.id.toString();
    this.title = category.title;
  }
}
