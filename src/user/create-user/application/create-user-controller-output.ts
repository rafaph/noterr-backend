import { ApiResponseProperty } from "@nestjs/swagger";
import { UUID } from "@app/lib/uuid";

export class CreateUserControllerOutput {
  @ApiResponseProperty()
  public readonly id!: string;

  public constructor(id: UUID) {
    this.id = id.toString();
  }
}
