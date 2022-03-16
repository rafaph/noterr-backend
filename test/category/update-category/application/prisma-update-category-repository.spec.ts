import faker from "faker";
import parallel from "mocha.parallel";
import { PrismaUpdateCategoryRepository } from "@app/category/update-category/application/prisma-update-category-repository";
import { UUID } from "@app/lib/uuid";
import { TestDatabase } from "@test/helpers/test-database";
import { makeDatabaseUser } from "@test/user/helpers/factories";

interface CategoryData {
  id: string;
  title: string;
  userId: string;
}

const makeCategories = (userId: UUID, amount = 2): CategoryData[] =>
  Array.from({ length: amount }, () => ({
    id: UUID.new().toString(),
    title: faker.name.title(),
    userId: userId.toString(),
  }));

parallel("PrismaUpdateCategoryRepository", () => {
  describe(".exists", () => {
    it("should return true if a category exists", async () => {
      await new TestDatabase().run(async (prisma) => {
        const user = await makeDatabaseUser(prisma);
        const [category] = makeCategories(user.id);

        await prisma.category.create({
          data: category,
        });

        const repository = new PrismaUpdateCategoryRepository(prisma);

        const result = await repository.exists({
          id: new UUID(category.id),
          title: category.title,
          userId: user.id,
        });

        expect(result).to.be.true;
      });
    });

    it("should return false if a category does not exist", async () => {
      await new TestDatabase().run(async (prisma) => {
        const user = await makeDatabaseUser(prisma);
        const [category] = makeCategories(user.id);

        const repository = new PrismaUpdateCategoryRepository(prisma);

        const result = await repository.exists({
          id: new UUID(category.id),
          title: category.title,
          userId: user.id,
        });

        expect(result).to.be.false;
      });
    });
  });

  describe(".canUpdate", () => {
    it("should return true if a title is not used by another category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const user = await makeDatabaseUser(prisma);
        const categories = makeCategories(user.id);

        await prisma.category.create({
          data: categories[0],
        });

        const repository = new PrismaUpdateCategoryRepository(prisma);

        const result = await repository.canUpdate({
          id: new UUID(categories[0].id),
          title: categories[1].title,
          userId: user.id,
        });

        expect(result).to.be.true;
      });
    });

    it("should return false if a title is used by another category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const user = await makeDatabaseUser(prisma);
        const categories = makeCategories(user.id);

        await prisma.category.createMany({
          data: categories,
        });

        const repository = new PrismaUpdateCategoryRepository(prisma);

        const result = await repository.canUpdate({
          id: new UUID(categories[0].id),
          title: categories[1].title,
          userId: user.id,
        });

        expect(result).to.be.false;
      });
    });
  });

  describe(".update", () => {
    it("should update a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const user = await makeDatabaseUser(prisma);
        const [category] = makeCategories(user.id);

        await prisma.category.create({
          data: category,
        });

        const repository = new PrismaUpdateCategoryRepository(prisma);

        const title = faker.name.title();
        await repository.update({
          id: new UUID(category.id),
          userId: user.id,
          title,
        });

        const result = await prisma.category.findUnique({
          where: {
            id: category.id,
          },
        });

        expect(result).to.not.be.null;
        expect(result?.title).to.be.equals(title);
      });
    });
  });
});
