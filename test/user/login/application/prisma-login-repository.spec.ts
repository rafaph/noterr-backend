import faker from "faker";
import parallel from "mocha.parallel";
import { UserEntity } from "@app/user/common/domain/user-entity";
import { PrismaLoginRepository } from "@app/user/login/application/prisma-login-repository";
import { TestDatabase } from "@test/helpers/test-database";

parallel("PrismaLoginRepository", () => {
  it("should find a user by email", async () => {
    await new TestDatabase().run(async (prisma) => {
      const email = faker.internet.email();
      await prisma.user.create({
        data: {
          id: faker.datatype.uuid(),
          password: faker.internet.password(),
          email,
        },
      });

      const repository = new PrismaLoginRepository(prisma);

      const user = await repository.findByEmail(email);

      expect(user).to.be.a.instanceof(UserEntity);
      expect(user?.email).to.be.equals(email);
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
