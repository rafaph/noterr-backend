import { Module, Global } from "@nestjs/common";
import { PrismaService } from "@app/shared/application/prisma-service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
