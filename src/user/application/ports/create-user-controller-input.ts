import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { MatchWith } from "@app/lib/class-validator/match-with";

export class CreateUserControllerInput {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({ required: true })
  @MinLength(6)
  @IsNotEmpty()
  public password!: string;

  @ApiProperty({ required: true })
  @MatchWith("password")
  @IsNotEmpty()
  public passwordConfirmation!: string;
}
