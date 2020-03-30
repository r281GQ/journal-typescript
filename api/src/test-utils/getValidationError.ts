import { ExecutionResult } from "graphql";
import { ArgumentValidationError } from "type-graphql";

export const getValidationError = (result: ExecutionResult): string => {
  if (
    result.errors &&
    result.errors[0].originalError instanceof ArgumentValidationError
  ) {
    const { validationErrors } = result.errors[0].originalError;

    const { constraints } = validationErrors[0];
    const names = Object.values(constraints);

    if (names[0]) {
      return names[0];
    }
  }

  throw "No ValidationError found.";
};
