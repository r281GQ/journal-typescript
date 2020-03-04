import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

import { ACCESS_TOKEN_SECRET } from "../Environment";
import { ApiContext } from "../types/ApiContext";
import { Payload } from "../types/Payload";

const getAuthHeader = (context: ApiContext): Payload => {
  try {
    const header = context.req.headers["authorization"];

    const bearer = header?.split(" ")[1] || "";

    const payload = verify(bearer, ACCESS_TOKEN_SECRET) as Payload;

    return payload;
  } catch {
    throw new Error("Not authorized!");
  }
};

export const isAuth: MiddlewareFn<ApiContext> = async ({ context }, next) => {
  const { user } = getAuthHeader(context);

  context.payload = {
    user
  };

  await next();
};
