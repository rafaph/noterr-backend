import { Injectable } from "@nestjs/common";
import { CategoryNotFound } from "@app/category/domain/errors";
import { DeleteCategoryUseCaseInput } from "@app/category/domain/ports/delete-category-use-case-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";

@Injectable()
export class DeleteCategoryUseCase {
  public constructor(private readonly repository: CategoryRepository) {}

  private async notExists(input: DeleteCategoryUseCaseInput): Promise<boolean> {
    const result = await this.repository.findOne({ id: input.id, userId: input.userId });

    return !result;
  }

  public async execute(input: DeleteCategoryUseCaseInput): Promise<Either<DefaultError, void>> {
    if (await this.notExists(input)) {
      return left(CategoryNotFound);
    }

    await this.repository.delete(input.id);

    return right(void 0);
  }
}
