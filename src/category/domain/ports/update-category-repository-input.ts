import { UUID } from "@app/lib/uuid";

export interface UpdateCategoryRepositoryInput {
  id: UUID;
  userId: UUID;
  title: string;
}
