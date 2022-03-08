/* eslint @typescript-eslint/no-explicit-any: "off" */
import { INestApplication } from "@nestjs/common";
import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { AppFactory } from "@app/app-factory";
import { AppModule } from "@app/app-module";
import { PrismaService } from "@app/shared/application/prisma-service";
import { TestDatabase } from "@test/helpers/test-database";

export class TestApplication {
  private app!: INestApplication;
  private moduleBuilder!: TestingModuleBuilder;
  private testDatabase = new TestDatabase();

  public constructor(moduleFixture?: TestingModuleBuilder) {
    if (moduleFixture) {
      this.moduleBuilder = moduleFixture;
    }
  }

  private async up(): Promise<void> {
    if (!this.moduleBuilder) {
      this.moduleBuilder = await Test.createTestingModule({
        imports: [AppModule],
      });
    }

    await this.testDatabase.up();

    const testingModule = await this.moduleBuilder
      .overrideProvider(PrismaService)
      .useValue(this.testDatabase.createPrisma())
      .compile();

    this.app = testingModule.createNestApplication();

    await AppFactory.setup(this.app);

    await this.app.init();
  }

  private async down(): Promise<void> {
    await this.app.get(PrismaService).$disconnect();
    await this.app.close();
    await this.testDatabase.down();
  }

  public async run(callback: (app: INestApplication) => Promise<void>): Promise<void> {
    await this.up();
    try {
      await callback(this.app);
    } finally {
      await this.down();
    }
  }
}
