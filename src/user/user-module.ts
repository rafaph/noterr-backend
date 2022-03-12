import { Module } from "@nestjs/common";
import { CreateUserModule } from "@app/user/create-user/create-user-module";

@Module({
  imports: [CreateUserModule],
})
export class UserModule {}
