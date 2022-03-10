import { CreateUserRepositoryInput } from "@app/user/create-user/domain/ports/create-user-repository-input";

export abstract class CreateUserRepository {
  public abstract create(input: CreateUserRepositoryInput): Promise<void>;
  public abstract exists(email: string): Promise<boolean>;
}
