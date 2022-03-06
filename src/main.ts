/* istanbul ignore file */
import { AppFactory } from "@app/app-factory";
import { OptionalEnv } from "@app/settings/environment-variables";

async function bootstrap(): Promise<void> {
  const app = await AppFactory.create();
  await app.listen(process.env[OptionalEnv.NOTERR_LISTEN_PORT] ?? 3000);
}

bootstrap().finally(() => {
  // eslint-disable-next-line no-console
  console.log("Server finished.");
});
