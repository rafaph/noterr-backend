import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/shared/application/prisma-service";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserRepositoryInput } from "@app/user/create-user/domain/ports/create-user-repository-input";

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
    return !!(await this.prisma.user.findUnique({
      where: { email },
    }));
  }
}
