import { Injectable } from "@nestjs/common";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { UserData } from "@app/auth/domain/user-data";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/prisma-service";

@Injectable()
export class PrismaLoginRepository implements LoginRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByEmail(email: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: new UUID(user.id),
      email: user.email,
      password: user.password,
    };
  }
}
