import "reflect-metadata";

import path from "path";
import bodyParser from "body-parser";
import express from "express";
import morganBody from "morgan-body";
import { useExpressServer, useContainer } from "routing-controllers";
import { createContainer } from "@app/main/config/create-container";
import { createInversifyAdapter } from "@app/main/config/create-inversify-adapter";

const container = createContainer();
const inversifyAdapter = createInversifyAdapter(container);

useContainer(inversifyAdapter);

const app = express();

app.use(bodyParser.json());

morganBody(app, {
  dateTimeFormat: "iso",
  timezone: "America/Sao_Paulo",
  logAllReqHeader: true,
  logAllResHeader: true,
  logRequestBody: true,
  logIP: false,
});

useExpressServer(app, {
  routePrefix: "api",
  controllers: [path.join(__dirname, "**", "*-controller.{ts,js}")],
  middlewares: [path.join(__dirname, "**", "*-middleware.{ts,js}")],
  interceptors: [path.join(__dirname, "**", "*-interceptors.{ts,js}")],
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.info("listening on port 3000...");
});
