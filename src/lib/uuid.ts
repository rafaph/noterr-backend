import { validate, version, v4 as uuid } from "uuid";

export class UUID {
  public constructor(private readonly identifier: string) {
    if (!validate(identifier) || version(identifier) !== 4) {
      throw new Error("Invalid uuid");
    }
  }

  public toString(): string {
    return this.identifier;
  }

  public equals(value: UUID): boolean {
    return value.toString() === this.identifier;
  }

  public static new(): UUID {
    return new UUID(uuid());
  }
}
