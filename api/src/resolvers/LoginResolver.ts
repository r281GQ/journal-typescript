import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../entities/User";
import { LoginParams } from "./loginResolver/LoginParams";
import { ApiContext } from "../types/ApiContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => Boolean)
  async login(
    @Arg("data") data: LoginParams,
    @Ctx() ctx: ApiContext
  ): Promise<boolean> {
    try {
      const { email, password } = data;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return false;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
