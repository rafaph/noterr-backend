/* istanbul ignore file */
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, HealthCheckResult } from "@nestjs/terminus";
import { Public } from "@app/auth/application/decorators/public-decorator";

@ApiTags("System")
@Controller("status")
export class StatusController {
  public constructor(private readonly healthCheckService: HealthCheckService) {}

  @Public()
  @Get()
  @HealthCheck()
  public handle(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([]);
  }
}
