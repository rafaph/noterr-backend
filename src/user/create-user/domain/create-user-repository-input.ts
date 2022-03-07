import { UUID } from "@app/lib/uuid";

export interface CreateUserRepositoryInput {
  id: UUID;
  email: string;
  password: string;
}
