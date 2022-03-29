import { DefaultError } from "@app/lib/error/default-error";

export const UserAlreadyExistsError: DefaultError = {
  message: "User already exists",
  code: "USER_ALREADY_EXISTS",
};
