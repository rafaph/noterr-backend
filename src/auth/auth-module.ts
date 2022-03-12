import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoginController } from "@app/auth/application/controllers/login-controller";
import { AuthGuard } from "@app/auth/application/guards/auth-guard";
import { PrismaIsAuthenticatedRepository } from "@app/auth/application/repositories/prisma-is-authenticated-repository";
import { PrismaLoginRepository } from "@app/auth/application/repositories/prisma-login-repository";
import { Argon2PasswordHasherService } from "@app/auth/application/services/argon2-password-hasher-service";
import { Argon2PasswordVerifierService } from "@app/auth/application/services/argon2-password-verifier-service";
import { FromHeaderTokenExtractorService } from "@app/auth/application/services/from-header-token-extractor-service";
import { JwtTokenSignerService } from "@app/auth/application/services/jwt-token-signer-service";
import { JwtTokenVerifierService } from "@app/auth/application/services/jwt-token-verifier-service";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";
import { PasswordVerifierService } from "@app/auth/domain/services/password-verifier-service";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { IsAuthenticatedUseCase } from "@app/auth/domain/use-cases/is-authenticated-use-case";
import { LoginUseCase } from "@app/auth/domain/use-cases/login-use-case";
import { JwtModuleInitializer } from "@app/auth/utils/jwt-module-initializer";

@Global()
@Module({
  providers: [
    {
      provide: PasswordHasherService,
      useClass: Argon2PasswordHasherService,
    },
    {
      provide: PasswordVerifierService,
      useClass: Argon2PasswordVerifierService,
    },
    {
      provide: TokenExtractorService,
      useClass: FromHeaderTokenExtractorService,
    },
    {
      provide: TokenSignerService,
      useClass: JwtTokenSignerService,
    },
    {
      provide: TokenVerifierService,
      useClass: JwtTokenVerifierService,
    },
    {
      provide: IsAuthenticatedRepository,
      useClass: PrismaIsAuthenticatedRepository,
    },
    {
      provide: LoginRepository,
      useClass: PrismaLoginRepository,
    },
    IsAuthenticatedUseCase,
    AuthGuard,
    LoginUseCase,
  ],
  controllers: [LoginController],
  imports: [
    JwtModule.registerAsync({
      useClass: JwtModuleInitializer,
    }),
  ],
  exports: [IsAuthenticatedUseCase, AuthGuard, PasswordHasherService],
})
export class AuthModule {}
