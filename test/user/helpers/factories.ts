import { PrismaService } from "@app/shared/application/prisma-service";
import { UserEntity } from "@app/user/common/domain/user-entity";
import { PrismaCreateUserRepository } from "@app/user/create-user/application/prisma-create-user-repository";
import { makeCreateUserRepositoryInput } from "@test/user/create-user/helpers/factories";

export const makeDatabaseUser = async (prisma: PrismaService): Promise<UserEntity> => {
  const input = await makeCreateUserRepositoryInput();
  const repository = new PrismaCreateUserRepository(prisma);

  await repository.create(input);

  return new UserEntity(input.id, input.email, input.password);
};
