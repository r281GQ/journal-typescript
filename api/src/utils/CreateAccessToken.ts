import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } from "../Environment";
import { Payload } from "../types/Payload";

export const createAccessToken = (payload: Payload) => {
  const {
    user: { id, role }
  } = payload;

  return sign({ user: { id, role } }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
};
