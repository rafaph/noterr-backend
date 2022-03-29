import { Injectable } from "@nestjs/common";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/services/prisma-service";

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
