import { Injectable } from "@nestjs/common";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryRepositoryInput } from "@app/category/create-category/domain/ports/create-category-repository-input";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/prisma-service";

@Injectable()
export class PrismaCreateCategoryRepository implements CreateCategoryRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(input: CreateCategoryRepositoryInput): Promise<void> {
    await this.prisma.category.create({
      data: {
        id: input.id.toString(),
        title: input.title,
        userId: input.userId.toString(),
      },
    });
  }

  public async exists(userId: UUID, title: string): Promise<boolean> {
    const result = await this.prisma.category.findFirst({
      where: {
        userId: userId.toString(),
        title,
      },
    });

    return !!result;
  }
}
