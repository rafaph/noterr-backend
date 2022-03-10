import { Body, Controller, HttpCode, HttpStatus, Post, Scope, UnauthorizedException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";
import { LoginControllerInput } from "@app/user/login/application/ports/login-controller-input";
import { LoginControllerOutput } from "@app/user/login/application/ports/login-controller-output";
import { LoginUseCase } from "@app/user/login/domain/login-use-case";

@Controller({ path: "api/v1/auth/login", scope: Scope.REQUEST })
@ApiTags("Auth")
export class LoginController {
  public constructor(private readonly useCase: LoginUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginControllerOutput })
  @ApiBadRequestResponse({ type: DefaultValidationResponse })
  @ApiUnauthorizedResponse({ type: DefaultErrorResponse })
  public async handle(@Body() input: LoginControllerInput): Promise<LoginControllerOutput> {
    const result = await this.useCase.execute({
      email: input.email,
      password: input.password,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException(result.value);
    }

    return new LoginControllerOutput(result.value);
  }
}
