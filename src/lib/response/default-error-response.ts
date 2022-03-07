import { ApiProperty } from "@nestjs/swagger";

export class DefaultErrorResponse {
  @ApiProperty({ example: "Default error" })
  public message!: string;

  @ApiProperty({ example: "DEFAULT_ERROR", required: false })
  public code!: string;
}
