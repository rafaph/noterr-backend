import { Module } from "@nestjs/common";
import { Argon2PasswordHasher } from "@app/common/application/argon2-password-hasher";
import { Argon2PasswordVerifier } from "@app/common/application/argon2-password-verifier";
import { PasswordHasher } from "@app/common/domain/password-hasher";
import { PasswordVerifier } from "@app/common/domain/password-verifier";

@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: PasswordVerifier,
      useClass: Argon2PasswordVerifier,
    },
  ],
  exports: [PasswordHasher, PasswordVerifier],
})
export class CommonModule {}
