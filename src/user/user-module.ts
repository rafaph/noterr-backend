import { Module } from "@nestjs/common";
import { CreateUserController } from "@app/user/application/controllers/create-user-controller";
import { PrismaCreateUserRepository } from "@app/user/application/repositories/prisma-create-user-repository";
import { CreateUserRepository } from "@app/user/domain/repositories/create-user-repository";
import { CreateUserUseCase } from "@app/user/domain/use-cases/create-user-use-case";

@Module({
  providers: [
    {
      provide: CreateUserRepository,
      useClass: PrismaCreateUserRepository,
    },
    CreateUserUseCase,
  ],
  controllers: [CreateUserController],
})
export class UserModule {}
