import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../entities/User";
import { LoginParams } from "./loginResolver/LoginParams";
import { JWT } from "./shared/JWT";
import { ApiContext } from "../types/ApiContext";
import { createAccessToken } from "../utils/CreateAccessToken";
import { createRefreshToken } from "../utils/CreateRefreshToken";

import { AuthenticationError } from "../errors/AuthenticationError";

@Resolver()
export class LoginResolver {
  @Mutation(() => JWT)
  async login(
    @Arg("data") data: LoginParams,
    @Ctx() context: ApiContext
  ): Promise<JWT> {
    try {
      const { email, password } = data;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new AuthenticationError();
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new AuthenticationError();
      }

      context.res.cookie(
        "jid",
        createRefreshToken({ user: { id: user.id, role: user.role } }),
        { httpOnly: true }
      );

      return {
        token: createAccessToken({ user: { id: user.id, role: user.role } })
      };
    } catch (e) {
      throw e;
    }
  }
}
