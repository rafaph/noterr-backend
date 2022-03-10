import { Injectable } from "@nestjs/common";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/prisma-service";
import { UserEntity } from "@app/user/common/domain/user-entity";
import { LoginRepository } from "@app/user/login/domain/login-repository";

@Injectable()
export class PrismaLoginRepository implements LoginRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new UserEntity(new UUID(user.id), user.email, user.password);
  }
}
