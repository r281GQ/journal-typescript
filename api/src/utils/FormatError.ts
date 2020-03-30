import { ArgumentValidationError } from "type-graphql";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { AuthenticationError } from "../errors/AuthenticationError";
import { AuthorizationError } from "../errors/AuthorizationError";

export const formatError: (
  error: GraphQLError
) => GraphQLFormattedError = error => {
  if (error.originalError instanceof ArgumentValidationError) {
    const { constraints } = error.originalError.validationErrors[0];

    const names = Object.values(constraints);

    return {
      ...error,
      message: names[0],
      extensions: []
    };
  }

  if (error.originalError instanceof AuthorizationError) {
    return {
      ...error,
      message: "You are not authorized to proceed.",
      extensions: []
    };
  }

  if (error.originalError instanceof AuthenticationError) {
    return {
      ...error,
      message: "Not valid email or password.",
      extensions: []
    };
  }

  return {
    ...error
  };
};
