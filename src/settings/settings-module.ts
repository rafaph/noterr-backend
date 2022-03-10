import { Global, Module } from "@nestjs/common";
import { ApplicationSettings } from "@app/settings/application-settings";

@Global()
@Module({
  providers: [ApplicationSettings],
  exports: [ApplicationSettings],
})
export class SettingsModule {}
