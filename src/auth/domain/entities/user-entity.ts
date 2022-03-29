import { UUID } from "@app/lib/uuid";

export class UserEntity {
  public constructor(public readonly id: UUID, public readonly email: string, public readonly password: string) {}
}
