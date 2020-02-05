import { sign } from "jsonwebtoken";
import { REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../Environment";
import { Payload } from "../types/apiContext/payload";

export const createRefreshToken = (payload: Payload) => {
  const {
    user: { id, role }
  } = payload;

  return sign({ user: { id, role } }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });
};
