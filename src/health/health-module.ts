import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { StatusController } from "@app/health/application/controllers/status-controller";

@Module({
  controllers: [StatusController],
  imports: [TerminusModule],
})
export class HealthModule {}
