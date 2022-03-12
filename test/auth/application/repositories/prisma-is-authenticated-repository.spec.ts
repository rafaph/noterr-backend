import parallel from "mocha.parallel";
import { PrismaIsAuthenticatedRepository } from "@app/auth/application/repositories/prisma-is-authenticated-repository";
import { UUID } from "@app/lib/uuid";
import { TestDatabase } from "@test/helpers/test-database";
import { makeDatabaseUser } from "@test/user/helpers/factories";

parallel("PrismaIsAuthenticatedRepository", () => {
  it("should return true if a user is found", async () => {
    await new TestDatabase().run(async (prisma) => {
      const user = await makeDatabaseUser(prisma);
      const repository = new PrismaIsAuthenticatedRepository(prisma);

      const result = await repository.exists(user.id);

      expect(result).to.be.true;
    });
  });

  it("should return false if a user is not found", async () => {
    await new TestDatabase().run(async (prisma) => {
      const userId = UUID.new();
      const repository = new PrismaIsAuthenticatedRepository(prisma);

      const result = await repository.exists(userId);

      expect(result).to.be.false;
    });
  });
});
