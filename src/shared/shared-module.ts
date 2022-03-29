import { Module, Global } from "@nestjs/common";
import { ApplicationSettings } from "@app/shared/application/application-settings";
import { PrismaService } from "@app/shared/application/services/prisma-service";

@Global()
@Module({
  providers: [ApplicationSettings, PrismaService],
  exports: [ApplicationSettings, PrismaService],
})
export class SharedModule {}
