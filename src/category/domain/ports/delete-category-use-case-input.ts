import { UUID } from "@app/lib/uuid";

export interface DeleteCategoryUseCaseInput {
  id: UUID;
  userId: UUID;
}
