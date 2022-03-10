import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { ApplicationSettings } from "@app/settings/application-settings";

@Injectable()
export class JwtModuleInitializer implements JwtOptionsFactory {
  public constructor(private readonly settings: ApplicationSettings) {}

  public createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: this.settings.user.jwtSecret,
      signOptions: {
        expiresIn: this.settings.user.jwtExpiresIn,
      },
    };
  }
}
