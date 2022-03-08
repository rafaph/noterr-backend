import faker from "faker";
import parallel from "mocha.parallel";
import { UUID } from "@app/lib/uuid";
import { PrismaCreateUserRepository } from "@app/user/create-user/application/prisma-create-user-repository";
import { TestDatabase } from "@test/helpers/test-database";

parallel("PrismaCreateUserRepository", () => {
  it("should add user to in memory array", async () => {
    await new TestDatabase().run(async (prisma) => {
      const repository = new PrismaCreateUserRepository(prisma);
      const input = {
        id: new UUID(faker.datatype.uuid()),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await repository.create(input);

      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      expect(user).to.not.be.null;
      expect(user?.id).to.be.equals(input.id.toString());
      expect(user?.email).to.be.equals(input.email);
      expect(user?.password).to.be.equals(input.password);
    });
  });

  it("should check if user exists", async () => {
    await new TestDatabase().run(async (prisma) => {
      const data = {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await prisma.user.create({ data });

      const repository = new PrismaCreateUserRepository(prisma);
      const exists = await repository.exists(data.email);

      expect(exists).to.be.true;
    });
  });
});
