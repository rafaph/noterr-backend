/* istanbul ignore file */
import { INestApplication, NestApplicationOptions, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app-module";
import { exceptionFactory } from "@app/lib/exception-factory";
import { validateSettings } from "@app/settings/validate-settings";
import { setupSwagger } from "@app/setup/setup-swagger";
import { PrismaService } from "@app/shared/application/prisma-service";

export class AppFactory {
  public static async setup(app: INestApplication): Promise<void> {
    await validateSettings();

    app.enableCors();
    setupSwagger(app);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        exceptionFactory,
      }),
    );

    app.get(PrismaService).enableShutdownHooks(app);

    app.enableShutdownHooks();
  }

  public static async create(options?: NestApplicationOptions): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, options);

    await this.setup(app);

    return app;
  }
}
