import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { CreateUserRepositoryInput } from "@app/user/domain/ports/create-user-repository-input";
import { CreateUserRepository } from "@app/user/domain/repositories/create-user-repository";

@Injectable()
export class PrismaCreateUserRepository implements CreateUserRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(input: CreateUserRepositoryInput): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: input.id.toString(),
        email: input.email,
        password: input.password,
      },
    });
  }

  public async exists(email: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!result;
  }
}
