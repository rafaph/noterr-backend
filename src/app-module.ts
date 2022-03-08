import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { StatusController } from "@app/health/status-controller";
import { UserModule } from "@app/user/user-module";

@Module({
  imports: [TerminusModule, UserModule],
  controllers: [StatusController],
})
export class AppModule {}
