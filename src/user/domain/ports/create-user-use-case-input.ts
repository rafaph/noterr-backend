import { CreateUserRepositoryInput } from "@app/user/domain/ports/create-user-repository-input";

export type CreateUserUseCaseInput = Omit<CreateUserRepositoryInput, "id">;
