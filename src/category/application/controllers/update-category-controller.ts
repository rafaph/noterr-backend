import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
  UnprocessableEntityException,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { UpdateCategoryControllerInput } from "@app/category/application/ports/update-category-controller-input";
import { CategoryNotFound } from "@app/category/domain/errors";
import { UpdateCategoryUseCase } from "@app/category/domain/use-cases/update-category-use-case";
import { IdParam } from "@app/lib/decorators";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { DefaultValidationResponse } from "@app/lib/response/default-validation-response";
import { UUID } from "@app/lib/uuid";

@Controller("api/v1/categories/:id")
@ApiTags("Categories")
export class UpdateCategoryController {
  public constructor(private readonly useCase: UpdateCategoryUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: DefaultErrorResponse })
  @ApiNoContentResponse({
    description: "Updated successfully",
  })
  @ApiBadRequestResponse({ type: DefaultValidationResponse })
  @ApiUnprocessableEntityResponse({ type: DefaultErrorResponse })
  @ApiNotFoundResponse({ type: DefaultErrorResponse })
  public async handle(
    @Body() { title }: UpdateCategoryControllerInput,
    @UserId() userId: UUID,
    @IdParam(CategoryNotFound) id: string,
  ): Promise<void> {
    const result = await this.useCase.execute({
      title,
      userId,
      id: new UUID(id),
    });

    if (result.isLeft()) {
      if (result.value.code === CategoryNotFound.code) {
        throw new NotFoundException(result.value);
      }
      throw new UnprocessableEntityException(result.value);
    }
  }
}
