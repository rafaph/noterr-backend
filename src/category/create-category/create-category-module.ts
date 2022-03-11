import { Module } from "@nestjs/common";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { PrismaCreateUserRepository } from "@app/user/create-user/application/prisma-create-user-repository";

@Module({
  providers: [
    {
      provide: CreateCategoryRepository,
      useClass: PrismaCreateUserRepository,
    },
  ],
})
export class CreateCategoryModule {}
