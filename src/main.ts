/* istanbul ignore file */
import { AppFactory } from "@app/setup/app-factory";
import { OptionalEnv } from "@app/shared/domain/environment-variables";

async function bootstrap(): Promise<void> {
  const app = await AppFactory.create();
  await app.listen(process.env[OptionalEnv.NOTERR_PORT] ?? 3000);
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Server started...");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server.");
    throw error;
  });
