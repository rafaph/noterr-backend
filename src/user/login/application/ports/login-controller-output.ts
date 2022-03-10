import { ApiResponseProperty } from "@nestjs/swagger";

export class LoginControllerOutput {
  @ApiResponseProperty()
  public readonly accessToken: string;

  public constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
