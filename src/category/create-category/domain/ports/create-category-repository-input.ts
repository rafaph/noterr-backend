import { UUID } from "@app/lib/uuid";

export interface CreateCategoryRepositoryInput {
  id: UUID;
  userId: UUID;
  title: string;
}
