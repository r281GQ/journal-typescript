import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../entities/User";
import { LoginParams } from "./loginResolver/LoginParams";
import { JWT } from "./shared/JWT";
// import { createAccessToken } from "../utils/CreateAccessToken";
import { ApiContext } from "../types/ApiContext";
import { createRefreshToken } from "../utils/CreateRefreshToken";

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
        throw new Error();
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error();
      }

      context.res.cookie(
        "jid",
        createRefreshToken({ user: { id: user.id, role: user.role } }),
        { httpOnly: true }
      );

      return {
        token: ""
        // token: createAccessToken({ user: { id: user.id, role: user.role } })
      };
    } catch (e) {
      throw e;
    }
  }
}
