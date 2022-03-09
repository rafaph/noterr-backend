import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SharedModule } from "@app/shared/shared-module";
import { JwtTokenService } from "@app/user/auth/login/application/jwt-token-service";
import { LoginController } from "@app/user/auth/login/application/login-controller";
import { PrismaLoginRepository } from "@app/user/auth/login/application/prisma-login-repository";
import { LoginRepository } from "@app/user/auth/login/domain/login-repository";
import { LoginService } from "@app/user/auth/login/domain/login-service";
import { TokenService } from "@app/user/auth/login/domain/token-service";
import { CommonModule } from "@app/user/common/common-module";

@Module({
  providers: [
    {
      provide: LoginRepository,
      useClass: PrismaLoginRepository,
    },
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    LoginService,
  ],
  controllers: [LoginController],
  imports: [
    SharedModule,
    CommonModule,
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: "60s" },
    }),
  ],
})
export class LoginModule {}
