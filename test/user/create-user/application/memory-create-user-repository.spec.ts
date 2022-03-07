import faker from "faker";
import { UUID } from "@app/lib/uuid";
import { MemoryCreateUserRepository } from "@app/user/create-user/application/memory-create-user-repository";
import { CreateUserRepositoryInput } from "@app/user/create-user/domain/create-user-repository-input";

describe("MemoryCreateUserRepository", () => {
  it("should add user to in memory array", async () => {
    const users: CreateUserRepositoryInput[] = [];
    const repository = new MemoryCreateUserRepository(users);
    const input = {
      id: new UUID(faker.datatype.uuid()),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await repository.create(input);

    expect(users[0]).to.be.deep.equals(input);
  });

  it("should check if user exists", async () => {
    const users: CreateUserRepositoryInput[] = [
      {
        id: new UUID(faker.datatype.uuid()),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    ];
    const repository = new MemoryCreateUserRepository(users);
    const exists = await repository.exists(users[0].email);

    expect(exists).to.be.true;
  });
});
