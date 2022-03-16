import { Module } from "@nestjs/common";
import { CreateCategoryModule } from "@app/category/create-category/create-category-module";
import { UpdateCategoryModule } from "@app/category/update-category/update-category-module";

@Module({
  imports: [CreateCategoryModule, UpdateCategoryModule],
})
export class CategoryModule {}
