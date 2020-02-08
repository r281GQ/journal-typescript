import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../entities/User";
import { LoginParams } from "./loginResolver/LoginParams";
import { JWT } from "./shared/JWT";
import { createAccessToken } from "../utils/CreateAccessToken";

@Resolver()
export class LoginResolver {
  @Mutation(() => JWT)
  async login(@Arg("data") data: LoginParams): Promise<JWT> {
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

      return {
        token: createAccessToken({ user: { id: user.id, role: user.role } })
      };
    } catch (e) {
      throw e;
    }
  }
}
