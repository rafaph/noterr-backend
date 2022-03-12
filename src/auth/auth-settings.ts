import { IsNotEmpty, IsString } from "class-validator";
import { Env } from "@app/settings/environment-variables";

export class AuthSettings {
  @IsNotEmpty()
  @IsString()
  public readonly jwtSecret = <string>process.env[Env.NOTERR_JWT_SECRET];

  @IsNotEmpty()
  @IsString()
  public readonly jwtExpiresIn = <string>process.env[Env.NOTERR_JWT_EXPIRES_IN];
}
