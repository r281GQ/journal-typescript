import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";

import { ApiContext } from "../types/ApiContext";
import { isAuth } from "../middlewares/isAuth";

@Resolver()
export class LogoutResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async logout(@Ctx() context: ApiContext): Promise<boolean> {
    try {
      context.res.cookie("jid", "", { httpOnly: true, expires: new Date(0) });

      return true;
    } catch (e) {
      return false;
    }
  }
}
