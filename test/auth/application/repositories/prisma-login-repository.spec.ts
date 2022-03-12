import faker from "faker";
import parallel from "mocha.parallel";
import { PrismaLoginRepository } from "@app/auth/application/repositories/prisma-login-repository";
import { TestDatabase } from "@test/helpers/test-database";
import { makeDatabaseUser } from "@test/user/helpers/factories";

parallel("PrismaLoginRepository", () => {
  it("should find a user by email", async () => {
    await new TestDatabase().run(async (prisma) => {
      const userData = await makeDatabaseUser(prisma);
      const repository = new PrismaLoginRepository(prisma);

      const user = await repository.findByEmail(userData.email);

      expect(user).to.not.be.null;
      expect(user?.id.toString()).to.be.equals(userData.id.toString());
      expect(user?.email).to.be.equals(userData.email);
    });
  });

  it("should return null if user is not found", async () => {
    await new TestDatabase().run(async (prisma) => {
      const email = faker.internet.email();
      const repository = new PrismaLoginRepository(prisma);

      const user = await repository.findByEmail(email);

      expect(user).to.be.null;
    });
  });
});
