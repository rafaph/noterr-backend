import { Injectable } from "@nestjs/common";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/prisma-service";

@Injectable()
export class PrismaIsAuthenticatedRepository implements IsAuthenticatedRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async exists(userId: UUID): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });

    return !!result;
  }
}
