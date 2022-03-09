import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginControllerInput {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  public password!: string;
}
