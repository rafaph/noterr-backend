import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserId } from "@app/auth/application/decorators/user-id-decorator";
import { ListCategoryControllerOutput } from "@app/category/application/ports/list-category-controller-output";
import { ListCategoryUseCase } from "@app/category/domain/use-cases/list-category-use-case";
import { DefaultErrorResponse } from "@app/lib/response/default-error-response";
import { UUID } from "@app/lib/uuid";

@Controller("api/v1/categories")
@ApiTags("Categories")
export class ListCategoryController {
  public constructor(private readonly useCase: ListCategoryUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: DefaultErrorResponse })
  @ApiOkResponse({
    description: "List successfully",
    type: ListCategoryControllerOutput,
    isArray: true,
  })
  public async handle(@UserId() userId: UUID): Promise<ListCategoryControllerOutput[]> {
    const categories = await this.useCase.execute({ userId });

    return categories.map((category) => new ListCategoryControllerOutput(category));
  }
}
