/* istanbul ignore file */
import { INestApplication, NestApplicationOptions, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app-module";
import { exceptionFactory } from "@app/lib/exception-factory";
import { setupSwagger } from "@app/setup/setup-swagger";

export class AppFactory {
  public static setup(app: INestApplication): void {
    app.enableCors();
    setupSwagger(app);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        exceptionFactory,
      }),
    );
  }

  public static async create(options?: NestApplicationOptions): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, options);

    this.setup(app);

    return app;
  }
}
