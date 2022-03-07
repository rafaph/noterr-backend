import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { CommonModule } from "@app/common/common-module";
import { StatusController } from "@app/health/status-controller";
import { UserModule } from "@app/user/user-module";

@Module({
  imports: [TerminusModule, CommonModule, UserModule],
  controllers: [StatusController],
})
export class AppModule {}
