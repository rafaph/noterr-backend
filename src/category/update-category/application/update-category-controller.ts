import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { UpdateCategoryControllerInput } from "@app/category/update-category/application/ports/update-category-controller-input";
import { CategoryNotFound } from "@app/category/update-category/domain/errors";
import { UpdateCategoryUseCase } from "@app/category/update-category/domain/update-category-use-case";
import { UUID } from "@app/lib/uuid";

@Controller("api/v1/categories/:id")
@ApiTags("Categories")
export class UpdateCategoryController {
  public constructor(private readonly useCase: UpdateCategoryUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  public async handle(
    @Body() { title }: UpdateCategoryControllerInput,
    @UserId() userId: UUID,
    @Param("id", new ParseUUIDPipe({ exceptionFactory: () => new NotFoundException(CategoryNotFound) })) id: string,
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
