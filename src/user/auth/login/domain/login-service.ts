import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { LoginRepository } from "@app/user/auth/login/domain/login-repository";
import { LoginServiceInput } from "@app/user/auth/login/domain/ports/login-service-input";
import { TokenService } from "@app/user/auth/login/domain/token-service";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";

@Injectable()
export class LoginService {
  public constructor(
    private readonly loginRepository: LoginRepository,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly tokenService: TokenService,
  ) {}

  public async execute(input: LoginServiceInput): Promise<Either<DefaultError, string>> {
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
