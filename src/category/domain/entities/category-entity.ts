import { UUID } from "@app/lib/uuid";

export class CategoryEntity {
  public constructor(public readonly id: UUID, public readonly userId: UUID, public readonly title: string) {}
}
