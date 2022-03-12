import { Injectable } from "@nestjs/common";
import { LoginUseCaseInput } from "@app/auth/domain/ports/login-use-case-input";
import { LoginRepository } from "@app/auth/domain/repositories/login-repository";
import { PasswordVerifierService } from "@app/auth/domain/services/password-verifier-service";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

@Injectable()
export class LoginUseCase {
  public constructor(
    private readonly repository: LoginRepository,
    private readonly passwordVerifier: PasswordVerifierService,
    private readonly tokenSigner: TokenSignerService,
  ) {}

  public async execute(input: LoginUseCaseInput): Promise<Either<DefaultError, string>> {
    const user = await this.repository.findByEmail(input.email);

    if (!user || !(await this.passwordVerifier.verify(user.password, input.password))) {
      return left({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = await this.tokenSigner.sign({
      userId: user.id.toString(),
    });

    return right(token);
  }
}
