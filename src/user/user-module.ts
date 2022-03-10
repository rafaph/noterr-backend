import { Module } from "@nestjs/common";
import { CreateUserModule } from "@app/user/create-user/create-user-module";
import { LoginModule } from "@app/user/login/login-module";

@Module({
  imports: [CreateUserModule, LoginModule],
})
export class UserModule {}
