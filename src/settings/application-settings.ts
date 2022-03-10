import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserSettings } from "@app/user/user-settings";

@Injectable()
export class ApplicationSettings {
  @ValidateNested()
  @Type(() => UserSettings)
  public readonly user = new UserSettings();
}
