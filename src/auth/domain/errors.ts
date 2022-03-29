import { DefaultError } from "@app/lib/error/default-error";

export const UnauthorizedError: DefaultError = {
  message: "Unauthorized",
  code: "UNAUTHORIZED",
};

export const InvalidCredentialsError: DefaultError = {
  message: "Invalid credentials",
  code: "INVALID_CREDENTIALS",
};

export const InvalidTokenError: DefaultError = {
  message: "Invalid token",
  code: "INVALID_TOKEN",
};

export const MissingAuthorizationHeaderError: DefaultError = {
  message: "Missing authorization header",
  code: "MISSING_AUTHORIZATION_HEADER",
};

export const InvalidTokenTypeError: DefaultError = {
  message: "Invalid token type",
  code: "INVALID_TOKEN_TYPE",
};

export const InvalidUserIdError: DefaultError = {
  message: "Invalid User Id",
  code: "INVALID_USER_ID",
};
