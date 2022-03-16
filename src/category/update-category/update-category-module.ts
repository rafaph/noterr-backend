import { Module } from "@nestjs/common";
import { PrismaUpdateCategoryRepository } from "@app/category/update-category/application/prisma-update-category-repository";
import { UpdateCategoryController } from "@app/category/update-category/application/update-category-controller";
import { UpdateCategoryRepository } from "@app/category/update-category/domain/update-category-repository";
import { UpdateCategoryUseCase } from "@app/category/update-category/domain/update-category-use-case";

@Module({
  providers: [
    {
      provide: UpdateCategoryRepository,
      useClass: PrismaUpdateCategoryRepository,
    },
    UpdateCategoryUseCase,
  ],
  controllers: [UpdateCategoryController],
})
export class UpdateCategoryModule {}
