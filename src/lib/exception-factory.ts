/* istanbul ignore file */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

const mapErrors = (errors: ValidationError[]): any => {
  const errorObject: any = {};
  for (const error of errors) {
    const property: any = {};

    if (error.constraints) {
      property.messages = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      property.children = mapErrors(error.children);
    }

    if (property) {
      errorObject[error.property] = property;
    }
  }
  return errorObject;
};

export const exceptionFactory = (errors: ValidationError[]): BadRequestException => {
  return new BadRequestException({
    message: "Validation error",
    code: "VALIDATION_ERROR",
    errors: mapErrors(errors),
  });
};
