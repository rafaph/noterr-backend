import { Module } from "@nestjs/common";
import { CreateCategoryController } from "@app/category/application/controllers/create-category-controller";
import { DeleteCategoryController } from "@app/category/application/controllers/delete-category-controller";
import { UpdateCategoryController } from "@app/category/application/controllers/update-category-controller";
import { PrismaCategoryRepository } from "@app/category/application/repositories/prisma-category-repository";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { CreateCategoryUseCase } from "@app/category/domain/use-cases/create-category-use-case";
import { DeleteCategoryUseCase } from "@app/category/domain/use-cases/delete-category-use-case";
import { UpdateCategoryUseCase } from "@app/category/domain/use-cases/update-category-use-case";

@Module({
  providers: [
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  controllers: [CreateCategoryController, UpdateCategoryController, DeleteCategoryController],
})
export class CategoryModule {}
