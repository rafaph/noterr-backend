import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, HealthCheckResult } from "@nestjs/terminus";

@ApiTags("System")
@Controller("status")
export class StatusController {
  public constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @HealthCheck()
  public handle(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([]);
  }
}
