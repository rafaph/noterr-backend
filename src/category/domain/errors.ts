import { DefaultError } from "@app/lib/error/default-error";

export enum CategoryError {
  CATEGORY_ALREADY_EXISTS = "CATEGORY_ALREADY_EXISTS",
  CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND",
}

export const CategoryAlreadyExistsError: DefaultError = {
  message: "Category already exists",
  code: CategoryError.CATEGORY_ALREADY_EXISTS,
};

export const CategoryNotFound: DefaultError = {
  message: "Category not found",
  code: CategoryError.CATEGORY_NOT_FOUND,
};
