/* istanbul ignore file */
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { setup, serve } from "swagger-ui-express";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Noterr Backend")
    .setDescription("Noterr Backend Documentation")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", in: "header" })
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, config);
  const setupHandler = setup(swaggerDoc, {
    customCss: ".swagger-ui .topbar { display: none; }",
    customSiteTitle: config.info.description,
  });

  app.use("/api-docs", serve, setupHandler);
}
