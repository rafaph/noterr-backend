import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { UUID } from "@app/lib/uuid";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserServiceInput } from "@app/user/create-user/domain/create-user-service-input";

@Injectable()
export class CreateUserService {
  public constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async execute(input: CreateUserServiceInput): Promise<Either<DefaultError, UUID>> {
    if (await this.createUserRepository.exists(input.email)) {
      return left({
        message: "User already exists",
        code: "USER_ALREADY_EXISTS",
      });
    }

    const id = UUID.new();
    await this.createUserRepository.create({
      ...input,
      password: await this.passwordHasher.hash(input.password),
      id,
    });

    return right(id);
  }
}
