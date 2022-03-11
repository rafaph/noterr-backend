import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { CategoryModule } from "@app/category/category-module";
import { StatusController } from "@app/health/status-controller";
import { SettingsModule } from "@app/settings/settings-module";
import { SharedModule } from "@app/shared/shared-module";
import { UserModule } from "@app/user/user-module";

@Module({
  imports: [SettingsModule, SharedModule, TerminusModule, UserModule, CategoryModule],
  controllers: [StatusController],
})
export class AppModule {}
