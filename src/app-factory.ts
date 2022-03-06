/* istanbul ignore file */
import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app-module";
import { setupSwagger } from "@app/setup/setup-swagger";

export class AppFactory {
  private static setup(app: INestApplication): void {
    app.enableCors();
    setupSwagger(app);
  }

  public static async create(options?: NestApplicationOptions): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, options);

    this.setup(app);

    return app;
  }
}
