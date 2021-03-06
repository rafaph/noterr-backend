/* istanbul ignore file */

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ApplicationSettings } from "@app/shared/application/application-settings";

export const validateSettings = async (): Promise<void> => {
  const settings = plainToInstance(ApplicationSettings, new ApplicationSettings(), {
    enableImplicitConversion: true,
  });

  const validationErrors = await validate(settings, {
    validationError: { target: false },
  });

  if (validationErrors.length > 0) {
    // eslint-disable-next-line no-console
    console.log("Invalid system configuration\n", JSON.stringify(validationErrors, null, 4));
    process.exit(1);
  }
};
