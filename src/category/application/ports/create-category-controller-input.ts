import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryControllerInput {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public title!: string;
}
