import { Module } from "@nestjs/common";
import { CommonModule } from "@app/user/common/common-module";
import { CreateUserController } from "@app/user/create-user/application/create-user-controller";
import { PrismaCreateUserRepository } from "@app/user/create-user/application/prisma-create-user-repository";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserUseCase } from "@app/user/create-user/domain/create-user-use-case";

@Module({
  providers: [
    {
      provide: CreateUserRepository,
      useClass: PrismaCreateUserRepository,
    },
    CreateUserUseCase,
  ],
  controllers: [CreateUserController],
  imports: [CommonModule],
})
export class CreateUserModule {}
