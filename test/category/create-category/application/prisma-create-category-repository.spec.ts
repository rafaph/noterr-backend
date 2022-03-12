import faker from "faker";
import parallel from "mocha.parallel";
import { PrismaCreateCategoryRepository } from "@app/category/create-category/application/prisma-create-category-repository";
import { UUID } from "@app/lib/uuid";
import { TestDatabase } from "@test/helpers/test-database";
import { makeDatabaseUser } from "@test/user/helpers/factories";

parallel("PrismaCreateCategoryRepository", async () => {
  describe(".create", () => {
    it("should add a category", async () => {
      await new TestDatabase().run(async (prisma) => {
        const { id: userId } = await makeDatabaseUser(prisma);
        const repository = new PrismaCreateCategoryRepository(prisma);
        const input = {
          id: UUID.new(),
          title: faker.lorem.sentence(),
          userId,
        };
        await repository.create(input);

        const result = await prisma.category.findUnique({
          where: {
            id: input.id.toString(),
          },
        });

        expect(result).to.not.be.null;
        expect(result?.id).to.be.equals(input.id.toString());
        expect(result?.title).to.be.equals(input.title);
        expect(result?.userId).to.be.equals(input.userId.toString());
      });
    });
  });

  describe(".exists", () => {
    it("should return false if users does not exist", async () => {
      await new TestDatabase().run(async (prisma) => {
        const repository = new PrismaCreateCategoryRepository(prisma);
        const userId = UUID.new();
        const title = faker.name.title();

        const result = await repository.exists(userId, title);

        expect(result).to.be.false;
      });
    });

    it("should return true if title already is in use", async () => {
      await new TestDatabase().run(async (prisma) => {
        const { id: userId } = await makeDatabaseUser(prisma);
        const title = faker.name.title();
        await prisma.category.create({
          data: {
            id: UUID.new().toString(),
            title,
            userId: userId.toString(),
          },
        });

        const repository = new PrismaCreateCategoryRepository(prisma);

        const result = await repository.exists(userId, title);

        expect(result).to.be.true;
      });
    });

    it("should return false if title free to use", async () => {
      await new TestDatabase().run(async (prisma) => {
        const { id: userId } = await makeDatabaseUser(prisma);
        const title = faker.name.title();

        const repository = new PrismaCreateCategoryRepository(prisma);

        const result = await repository.exists(userId, title);

        expect(result).to.be.false;
      });
    });
  });
});
