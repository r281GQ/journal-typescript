import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

import { ACCESS_TOKEN_SECRET } from "../Environment";
import { ApiContext } from "../types/ApiContext";

const getAuthHeader = (context: ApiContext): string => {
  try {
    const header = context.req.headers["authorization"];

    const bearer = header?.split(" ")[1] || "";

    verify(ACCESS_TOKEN_SECRET, bearer);

    return bearer;
  } catch (e) {
    throw new Error("not authorized");
  }
};

export const isAuth: MiddlewareFn<ApiContext> = async (
  { args, info, context, root },
  next
) => {
  getAuthHeader(context);

  await next();
};
