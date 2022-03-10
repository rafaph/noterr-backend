import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from "@app/user/common/common-module";
import { JwtModuleInitializer } from "@app/user/common/jwt-module-initializer";
import { JwtTokenService } from "@app/user/login/application/jwt-token-service";
import { LoginController } from "@app/user/login/application/login-controller";
import { PrismaLoginRepository } from "@app/user/login/application/prisma-login-repository";
import { LoginRepository } from "@app/user/login/domain/login-repository";
import { LoginUseCase } from "@app/user/login/domain/login-use-case";
import { TokenService } from "@app/user/login/domain/token-service";

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
    LoginUseCase,
  ],
  controllers: [LoginController],
  imports: [
    CommonModule,
    JwtModule.registerAsync({
      useClass: JwtModuleInitializer,
    }),
  ],
})
export class LoginModule {}
