import { Injectable } from "@nestjs/common";
import { UpdateCategoryRepositoryInput } from "@app/category/update-category/domain/ports/update-category-repository-input";
import { UpdateCategoryRepository } from "@app/category/update-category/domain/update-category-repository";
import { PrismaService } from "@app/shared/application/prisma-service";

@Injectable()
export class PrismaUpdateCategoryRepository implements UpdateCategoryRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async exists(input: UpdateCategoryRepositoryInput): Promise<boolean> {
    const result = await this.prisma.category.findFirst({
      where: {
        userId: input.userId.toString(),
        id: input.id.toString(),
      },
    });

    return !!result;
  }

  public async canUpdate(input: UpdateCategoryRepositoryInput): Promise<boolean> {
    const result = await this.prisma.category.findFirst({
      where: {
        userId: input.userId.toString(),
        title: input.title,
        id: {
          not: input.id.toString(),
        },
      },
    });

    return !result;
  }

  public async update(input: UpdateCategoryRepositoryInput): Promise<void> {
    await this.prisma.category.update({
      data: {
        title: input.title,
      },
      where: {
        id: input.id.toString(),
      },
    });
  }
}
