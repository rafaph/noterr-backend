import { Module } from "@nestjs/common";
import { SharedModule } from "@app/shared/shared-module";
import { CommonModule } from "@app/user/common/common-module";
import { CreateUserController } from "@app/user/create-user/application/create-user-controller";
import { PrismaCreateUserRepository } from "@app/user/create-user/application/prisma-create-user-repository";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserService } from "@app/user/create-user/domain/create-user-service";

@Module({
  providers: [
    {
      provide: CreateUserRepository,
      useClass: PrismaCreateUserRepository,
    },
    CreateUserService,
  ],
  controllers: [CreateUserController],
  imports: [SharedModule, CommonModule],
})
export class CreateUserModule {}
