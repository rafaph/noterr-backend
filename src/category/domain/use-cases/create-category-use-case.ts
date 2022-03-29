import { Injectable } from "@nestjs/common";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryAlreadyExistsError } from "@app/category/domain/errors";
import { CreateCategoryUseCaseInput } from "@app/category/domain/ports/create-category-use-case-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";
import { UUID } from "@app/lib/uuid";

@Injectable()
export class CreateCategoryUseCase {
  public constructor(private readonly repository: CategoryRepository) {}

  private async cannotCreate(input: CreateCategoryUseCaseInput): Promise<boolean> {
    const result = await this.repository.findOne({
      title: input.title,
      userId: input.userId,
    });

    return !!result;
  }

  public async execute(input: CreateCategoryUseCaseInput): Promise<Either<DefaultError, UUID>> {
    if (await this.cannotCreate(input)) {
      return left(CategoryAlreadyExistsError);
    }

    const id = UUID.new();
    await this.repository.create(new CategoryEntity(id, input.userId, input.title));

    return right(id);
  }
}
