import { Module } from "@nestjs/common";
import { PrismaService } from "@app/shared/application/prisma-service";

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
