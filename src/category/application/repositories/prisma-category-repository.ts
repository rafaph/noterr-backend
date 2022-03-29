import { Injectable } from "@nestjs/common";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/services/prisma-service";

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(item: CategoryEntity): Promise<void> {
    await this.prisma.category.create({
      data: {
        id: item.id.toString(),
        userId: item.userId.toString(),
        title: item.title,
      },
    });
  }

  public async delete(id: UUID): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id: id.toString(),
      },
    });
  }

  public async find(item: Partial<Interface<CategoryEntity>>): Promise<CategoryEntity[]> {
    const result = await this.prisma.category.findMany({
      where: {
        id: item.id?.toString(),
        userId: item.userId?.toString(),
        title: item.title,
      },
    });

    return result.map((data) => new CategoryEntity(new UUID(data.id), new UUID(data.userId), data.title));
  }

  public async findOne(item: Partial<Interface<CategoryEntity>>): Promise<CategoryEntity | void> {
    const result = await this.prisma.category.findFirst({
      where: {
        id: item.id?.toString(),
        userId: item.userId?.toString(),
        title: item.title,
      },
    });

    if (result) {
      return new CategoryEntity(new UUID(result.id), new UUID(result.userId), result.title);
    }
  }

  public async update(item: CategoryEntity): Promise<void> {
    await this.prisma.category.update({
      where: {
        id: item.id.toString(),
      },
      data: {
        title: item.title,
        userId: item.userId.toString(),
      },
    });
  }
}
