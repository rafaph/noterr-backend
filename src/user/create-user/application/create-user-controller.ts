import { Body, Controller, HttpCode, HttpStatus, Post, Scope, UnprocessableEntityException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";
import { CreateUserControllerInput } from "@app/user/create-user/application/create-user-controller-input";
import { CreateUserControllerOutput } from "@app/user/create-user/application/create-user-controller-output";
import { CreateUserService } from "@app/user/create-user/domain/create-user-service";

@Controller({ path: "api/v1/users", scope: Scope.REQUEST })
@ApiTags("Users")
export class CreateUserController {
  public constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({ type: DefaultValidationResponse })
  @ApiCreatedResponse({ type: CreateUserControllerOutput })
  @ApiUnprocessableEntityResponse({ type: DefaultErrorResponse })
  public async handle(@Body() input: CreateUserControllerInput): Promise<CreateUserControllerOutput> {
    const result = await this.createUserService.execute({
      email: input.email,
      password: input.password,
    });

    if (result.isLeft()) {
      throw new UnprocessableEntityException(result.value);
    }

    return new CreateUserControllerOutput(result.value);
  }
}
