import { Injectable } from "@nestjs/common";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { UUID } from "@app/lib/uuid";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserUseCaseInput } from "@app/user/create-user/domain/ports/create-user-use-case-input";

@Injectable()
export class CreateUserUseCase {
  public constructor(
    private readonly repository: CreateUserRepository,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  public async execute(input: CreateUserUseCaseInput): Promise<Either<DefaultError, UUID>> {
    if (await this.repository.exists(input.email)) {
      return left({
        message: "User already exists",
        code: "USER_ALREADY_EXISTS",
      });
    }

    const id = UUID.new();
    await this.repository.create({
      ...input,
      password: await this.passwordHasher.hash(input.password),
      id,
    });

    return right(id);
  }
}
