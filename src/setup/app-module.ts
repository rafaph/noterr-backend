import { Module } from "@nestjs/common";
import { AuthModule } from "@app/auth/auth-module";
import { CategoryModule } from "@app/category/category-module";
import { HealthModule } from "@app/health/health-module";
import { SharedModule } from "@app/shared/shared-module";
import { UserModule } from "@app/user/user-module";

@Module({
  imports: [HealthModule, SharedModule, AuthModule, UserModule, CategoryModule],
})
export class AppModule {}
