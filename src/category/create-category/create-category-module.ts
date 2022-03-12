import { Module } from "@nestjs/common";
import { CreateCategoryController } from "@app/category/create-category/application/create-category-controller";
import { PrismaCreateCategoryRepository } from "@app/category/create-category/application/prisma-create-category-repository";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryUseCase } from "@app/category/create-category/domain/create-category-use-case";

@Module({
  providers: [
    {
      provide: CreateCategoryRepository,
      useClass: PrismaCreateCategoryRepository,
    },
    CreateCategoryUseCase,
  ],
  controllers: [CreateCategoryController],
})
export class CreateCategoryModule {}
