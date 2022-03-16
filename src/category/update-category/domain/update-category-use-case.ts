import { Injectable } from "@nestjs/common";
import { CategoryAlreadyExistsError, CategoryNotFound } from "@app/category/update-category/domain/errors";
import { UpdateCategoryUseCaseInput } from "@app/category/update-category/domain/ports/update-category-use-case-input";
import { UpdateCategoryRepository } from "@app/category/update-category/domain/update-category-repository";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

@Injectable()
export class UpdateCategoryUseCase {
  public constructor(private readonly repository: UpdateCategoryRepository) {}

  public async execute(input: UpdateCategoryUseCaseInput): Promise<Either<DefaultError, void>> {
    const exists = await this.repository.exists(input);

    if (!exists) {
      return left(CategoryNotFound);
    }

    const canUpdate = await this.repository.canUpdate(input);

    if (!canUpdate) {
      return left(CategoryAlreadyExistsError);
    }

    await this.repository.update(input);

    return right(void 0);
  }
}
