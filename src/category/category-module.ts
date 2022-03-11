import { Module } from "@nestjs/common";
import { CreateCategoryModule } from "@app/category/create-category/create-category-module";

@Module({
  imports: [CreateCategoryModule],
})
export class CategoryModule {}
