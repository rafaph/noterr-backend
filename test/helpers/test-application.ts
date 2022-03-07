/* eslint @typescript-eslint/no-explicit-any: "off" */
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppFactory } from "@app/app-factory";
import { AppModule } from "@app/app-module";

export class TestApplication {
  private app!: INestApplication;
  private moduleFixture!: TestingModule;

  public constructor(moduleFixture?: TestingModule) {
    if (moduleFixture) {
      this.moduleFixture = moduleFixture;
    }
  }

  private async init(): Promise<void> {
    if (!this.moduleFixture) {
      this.moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    }

    this.app = this.moduleFixture.createNestApplication();

    AppFactory.setup(this.app);

    await this.app.init();
  }

  public async run(callback: (app: INestApplication) => Promise<void>): Promise<void> {
    await this.init();
    try {
      await callback(this.app);
    } finally {
      await this.app.close();
    }
  }
}
