import faker from "faker";
import parallel from "mocha.parallel";
import { PrismaCategoryRepository } from "@app/category/application/repositories/prisma-category-repository";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { TestDatabase } from "@test/helpers/test-database";
import { makeDatabaseUser } from "@test/user/helpers/factories";

const makeSut = (prisma: PrismaService): CategoryRepository => new PrismaCategoryRepository(prisma);

export const makeCategory = async (
  prisma: PrismaService,
  entity: Partial<Interface<CategoryEntity>> = {},
): Promise<CategoryEntity> => {
  const values = {
    id: UUID.new(),
    userId: UUID.new(),
    title: faker.name.title(),
    ...entity,
  };

  await makeDatabaseUser(prisma, {
    id: values.userId,
  });

  return new CategoryEntity(values.id, values.userId, values.title);
};

parallel("PrismaCategoryRepository", () => {
  describe(".create", () => {
    it("should create a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await repository.create(category);

        const result = await prisma.category.findUnique({
          where: {
            id: category.id.toString(),
          },
        });

        expect(result).to.not.be.null;
        expect(result?.id).to.be.equals(category.id.toString());
        expect(result?.userId).to.be.equals(category.userId.toString());
        expect(result?.title).to.be.equals(category.title);
      });
    });
  });

  describe(".delete", () => {
    it("should delete a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await prisma.category.create({
          data: {
            id: category.id.toString(),
            userId: category.userId.toString(),
            title: category.title,
          },
        });

        await repository.delete(category.id);

        const result = await prisma.category.findUnique({
          where: {
            id: category.id.toString(),
          },
        });

        expect(result).to.be.null;
      });
    });
  });

  describe(".find", () => {
    it("should find a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await prisma.category.create({
          data: {
            id: category.id.toString(),
            userId: category.userId.toString(),
            title: category.title,
          },
        });

        const result = await repository.find({
          title: category.title,
        });

        expect(result).to.be.array();
        expect(result).to.be.ofSize(1);
        expect(result[0].id).to.be.deep.equals(category.id);
      });
    });

    it("should find a category with a userId", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await prisma.category.create({
          data: {
            id: category.id.toString(),
            userId: category.userId.toString(),
            title: category.title,
          },
        });

        const result = await repository.find({
          id: category.id,
          userId: category.userId,
        });

        expect(result).to.be.array();
        expect(result).to.be.ofSize(1);
        expect(result[0].id).to.be.deep.equals(category.id);
      });
    });
  });

  describe(".findOne", () => {
    it("should findOne category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await prisma.category.create({
          data: {
            id: category.id.toString(),
            userId: category.userId.toString(),
            title: category.title,
          },
        });

        const result = await repository.findOne({
          title: category.title,
        });

        expect(result).to.not.be.undefined;
        expect(result?.id).to.be.deep.equals(category.id);
      });
    });

    it("should not findOne category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        const result = await repository.findOne({
          title: category.title,
        });

        expect(result).to.be.undefined;
      });
    });
  });

  describe(".update", () => {
    it("should update a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = makeSut(prisma);
        const category = await makeCategory(prisma);

        await prisma.category.create({
          data: {
            id: category.id.toString(),
            userId: category.userId.toString(),
            title: category.title,
          },
        });

        const title = faker.name.title();
        await repository.update(new CategoryEntity(category.id, category.userId, title));

        const result = await prisma.category.findUnique({
          where: {
            id: category.id.toString(),
          },
        });

        expect(result).to.not.be.null;
        expect(result?.id).to.be.equals(category.id.toString());
        expect(result?.title).to.be.equals(title);
      });
    });
  });
});
