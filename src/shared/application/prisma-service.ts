import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public enableShutdownHooks(app: INestApplication): void {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
