import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { StatusController } from "@app/health/status-controller";
import { SettingsModule } from "@app/settings/settings-module";
import { SharedModule } from "@app/shared/shared-module";
import { UserModule } from "@app/user/user-module";

@Module({
  imports: [SettingsModule, SharedModule, TerminusModule, UserModule],
  controllers: [StatusController],
})
export class AppModule {}
