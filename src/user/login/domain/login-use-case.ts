import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";
import { LoginRepository } from "@app/user/login/domain/login-repository";
import { LoginUseCaseInput } from "@app/user/login/domain/ports/login-use-case-input";
import { TokenService } from "@app/user/login/domain/token-service";

@Injectable()
export class LoginUseCase {
  public constructor(
    private readonly loginRepository: LoginRepository,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly tokenService: TokenService,
  ) {}

  public async execute(input: LoginUseCaseInput): Promise<Either<DefaultError, string>> {
    const user = await this.loginRepository.findByEmail(input.email);

    if (!user || !(await this.passwordVerifier.verify(user.password, input.password))) {
      return left({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = await this.tokenService.sign(user);

    return right(token);
  }
}
