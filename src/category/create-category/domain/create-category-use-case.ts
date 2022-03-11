import { Injectable } from "@nestjs/common";
import { CreateCategoryRepository } from "@app/category/create-category/domain/create-category-repository";
import { CreateCategoryUseCaseInput } from "@app/category/create-category/domain/ports/create-category-use-case-input";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { UUID } from "@app/lib/uuid";

@Injectable()
export class CreateCategoryUseCase {
  public constructor(private readonly createCategoryRepository: CreateCategoryRepository) {}

  public async execute(input: CreateCategoryUseCaseInput): Promise<Either<DefaultError, UUID>> {
    if (await this.createCategoryRepository.exists(input.userId, input.title)) {
      return left({
        message: "Category already exists",
        code: "CATEGORY_ALREADY_EXISTS",
      });
    }

    const id = UUID.new();
    await this.createCategoryRepository.create({
      ...input,
      id,
    });

    return right(id);
  }
}
