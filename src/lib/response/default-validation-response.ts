import { ApiProperty } from "@nestjs/swagger";

export class DefaultValidationResponse {
  @ApiProperty({ example: "Validation error" })
  public message!: string;

  @ApiProperty({ example: "VALIDATION_ERROR" })
  public code!: string;

  @ApiProperty({
    example: {
      email: {
        messages: ["email must be an email"],
      },
      password: {
        messages: ["password should not be empty", "password must be longer than or equal to 6 characters"],
      },
      passwordConfirmation: {
        messages: ["passwordConfirmation must match with password."],
      },
    },
  })
  public errors?: Record<
    string,
    {
      messages: string[];
      children?: Record<string, unknown>;
    }
  >;
}
