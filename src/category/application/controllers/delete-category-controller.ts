import { Controller, Delete, HttpCode, HttpStatus, NotFoundException } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { CategoryNotFound } from "@app/category/domain/errors";
import { DeleteCategoryUseCase } from "@app/category/domain/use-cases/delete-category-use-case";
import { IdParam } from "@app/lib/decorators";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { UUID } from "@app/lib/uuid";

@Controller("api/v1/categories/:id")
@ApiTags("Categories")
export class DeleteCategoryController {
  public constructor(private readonly useCase: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: DefaultErrorResponse })
  @ApiNoContentResponse({
    description: "Deleted successfully",
  })
  @ApiNotFoundResponse({ type: DefaultErrorResponse })
  public async handle(@UserId() userId: UUID, @IdParam(CategoryNotFound) id: string): Promise<void> {
    const result = await this.useCase.execute({
      id: new UUID(id),
      userId,
    });

    if (result.isLeft()) {
      throw new NotFoundException(result.value);
    }
  }
}
