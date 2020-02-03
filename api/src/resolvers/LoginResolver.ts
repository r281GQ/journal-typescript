import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../entities/User";
import { LoginParams } from "./loginResolver/LoginParams";

@Resolver()
export class LoginResolver {
  @Mutation(() => Boolean)
  async login(@Arg("data") data: LoginParams): Promise<boolean> {
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
