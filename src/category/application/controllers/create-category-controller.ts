import { Body, Controller, HttpCode, HttpStatus, Post, UnprocessableEntityException } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { CreateCategoryControllerInput } from "@app/category/application/ports/create-category-controller-input";
import { CreateCategoryControllerOutput } from "@app/category/application/ports/create-category-controller-output";
import { CreateCategoryUseCase } from "@app/category/domain/use-cases/create-category-use-case";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";
import { UUID } from "@app/lib/uuid";

@Controller("api/v1/categories")
@ApiTags("Categories")
export class CreateCategoryController {
  public constructor(private readonly useCase: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: DefaultErrorResponse })
  @ApiBadRequestResponse({ type: DefaultValidationResponse })
  @ApiUnprocessableEntityResponse({ type: DefaultErrorResponse })
  @ApiCreatedResponse({ type: CreateCategoryControllerOutput })
  public async handle(
    @Body() { title }: CreateCategoryControllerInput,
    @UserId() userId: UUID,
  ): Promise<CreateCategoryControllerOutput> {
    const result = await this.useCase.execute({
      title,
      userId,
    });

    if (result.isLeft()) {
      throw new UnprocessableEntityException(result.value);
    }

    return new CreateCategoryControllerOutput(result.value);
  }
}
