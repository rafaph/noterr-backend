import { Module } from "@nestjs/common";
import { CommonModule } from "@app/user/common/common-module";
import { CreateUserController } from "@app/user/create-user/application/create-user-controller";
import { MemoryCreateUserRepository } from "@app/user/create-user/application/memory-create-user-repository";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserService } from "@app/user/create-user/domain/create-user-service";

@Module({
  providers: [
    {
      provide: CreateUserRepository,
      useClass: MemoryCreateUserRepository,
    },
    CreateUserService,
  ],
  controllers: [CreateUserController],
  imports: [CommonModule],
})
export class CreateUserModule {}
