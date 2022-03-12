import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LoginControllerInput } from "@app/auth/application/ports/login-controller-input";
import { LoginControllerOutput } from "@app/auth/application/ports/login-controller-output";
import { LoginUseCase } from "@app/auth/domain/use-cases/login-use-case";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";

@Controller("api/v1/auth/login")
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
