import { Argon2PasswordHasherService } from "@app/auth/application/services/argon2-password-hasher-service";
import { UserData } from "@app/auth/domain/user-data";
import { PrismaService } from "@app/shared/application/prisma-service";
import { makeUserData } from "@test/auth/helpers/factories";

export const makeDatabaseUser = async (prisma: PrismaService, userData: Partial<UserData> = {}): Promise<UserData> => {
  const user = makeUserData(userData);

  await prisma.user.create({
    data: {
      id: user.id.toString(),
      email: user.email,
      password: await new Argon2PasswordHasherService().hash(user.password),
    },
  });

  return user;
};
