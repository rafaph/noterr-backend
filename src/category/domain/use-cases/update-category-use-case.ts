import { Injectable } from "@nestjs/common";
import { CategoryAlreadyExistsError, CategoryNotFound } from "@app/category/domain/errors";
import { UpdateCategoryUseCaseInput } from "@app/category/domain/ports/update-category-use-case-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";

@Injectable()
export class UpdateCategoryUseCase {
  public constructor(private readonly repository: CategoryRepository) {}

  private async cannotUpdate(input: UpdateCategoryUseCaseInput): Promise<boolean> {
    const result = await this.repository.findOne({
      userId: input.userId,
      title: input.title,
    });

    return !!result && !result.id.equals(input.id);
  }

  private async notExists(input: UpdateCategoryUseCaseInput): Promise<boolean> {
    const result = await this.repository.findOne({ id: input.id, userId: input.userId });

    return !result;
  }

  public async execute(input: UpdateCategoryUseCaseInput): Promise<Either<DefaultError, void>> {
    if (await this.notExists(input)) {
      return left(CategoryNotFound);
    }

    if (await this.cannotUpdate(input)) {
      return left(CategoryAlreadyExistsError);
    }

    await this.repository.update(input);

    return right(void 0);
  }
}
