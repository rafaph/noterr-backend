import { Module } from "@nestjs/common";
import { LoginModule } from "@app/user/auth/login/login-module";
import { CreateUserModule } from "@app/user/create-user/create-user-module";

@Module({
  imports: [CreateUserModule, LoginModule],
})
export class UserModule {}
