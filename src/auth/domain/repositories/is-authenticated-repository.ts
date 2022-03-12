import { UUID } from "@app/lib/uuid";

export abstract class IsAuthenticatedRepository {
  public abstract exists(userId: UUID): Promise<boolean>;
}
