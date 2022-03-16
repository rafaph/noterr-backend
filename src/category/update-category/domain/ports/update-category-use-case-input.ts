import { UUID } from "@app/lib/uuid";

export interface UpdateCategoryUseCaseInput {
  id: UUID;
  userId: UUID;
  title: string;
}
