/* istanbul ignore file */
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as swagger from "swagger-ui-express";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Noterr Backend")
    .setDescription("Noterr Backend Documentation")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const swaggerHtml = swagger.generateHTML(document);
  const httpAdapter = app.getHttpAdapter();

  app.use("/docs", swagger.serve);
  httpAdapter.get("/docs", (_, response) => response.send(swaggerHtml));
  httpAdapter.get("/docs-json", (_, response) => response.json(document));
}
