import { CreateUserRepositoryInput } from "@app/user/create-user/domain/create-user-repository-input";

export type CreateUserServiceInput = Omit<CreateUserRepositoryInput, "id">;
