import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AuthSettings } from "@app/auth/auth-settings";

@Injectable()
export class ApplicationSettings {
  @ValidateNested()
  @Type(() => AuthSettings)
  public readonly auth = new AuthSettings();
}
