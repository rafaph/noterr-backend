import { Injectable } from "@nestjs/common";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";
import { UUID } from "@app/lib/uuid";
import { UserAlreadyExistsError } from "@app/user/domain/errors";
import { CreateUserUseCaseInput } from "@app/user/domain/ports/create-user-use-case-input";
import { CreateUserRepository } from "@app/user/domain/repositories/create-user-repository";

@Injectable()
export class CreateUserUseCase {
  public constructor(
    private readonly repository: CreateUserRepository,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  public async execute(input: CreateUserUseCaseInput): Promise<Either<DefaultError, UUID>> {
    if (await this.repository.exists(input.email)) {
      return left(UserAlreadyExistsError);
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
