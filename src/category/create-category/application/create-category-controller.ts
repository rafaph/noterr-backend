import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Scope,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { AuthGuard } from "@app/auth/application/guards/auth-guard";
import { CreateCategoryControllerInput } from "@app/category/create-category/application/ports/create-category-controller-input";
import { CreateCategoryControllerOutput } from "@app/category/create-category/application/ports/create-category-controller-output";
import { CreateCategoryUseCase } from "@app/category/create-category/domain/create-category-use-case";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";
import { UUID } from "@app/lib/uuid";

@Controller({ path: "api/v1/categories", scope: Scope.REQUEST })
@UseGuards(AuthGuard)
@ApiTags("Categories")
@ApiBadRequestResponse({ type: DefaultValidationResponse })
@ApiCreatedResponse({ type: CreateCategoryControllerOutput })
@ApiUnprocessableEntityResponse({ type: DefaultErrorResponse })
export class CreateCategoryController {
  public constructor(private readonly useCase: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async handle(
    @Body() input: CreateCategoryControllerInput,
    @UserId() userId: UUID,
  ): Promise<CreateCategoryControllerOutput> {
    const result = await this.useCase.execute({
      title: input.title,
      userId,
    });

    if (result.isLeft()) {
      throw new UnprocessableEntityException(result.value);
    }

    return new CreateCategoryControllerOutput(result.value);
  }
}
