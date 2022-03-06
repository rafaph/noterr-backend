import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { StatusController } from "@app/health/status-controller";

@Module({
  imports: [TerminusModule],
  controllers: [StatusController],
})
export class AppModule {}
