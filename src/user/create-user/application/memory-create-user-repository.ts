import { Injectable, Optional } from "@nestjs/common";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
import { CreateUserRepositoryInput } from "@app/user/create-user/domain/create-user-repository-input";

@Injectable()
export class MemoryCreateUserRepository implements CreateUserRepository {
  public constructor(
    @Optional()
    private readonly users: CreateUserRepositoryInput[] = [],
  ) {}

  public async create(input: CreateUserRepositoryInput): Promise<void> {
    this.users.push(input);
  }

  public async exists(email: string): Promise<boolean> {
    return !!this.users.find((user) => user.email === email);
  }
}
