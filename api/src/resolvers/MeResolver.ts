import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";

import { User } from "../entities/User";
import { isAuth } from "../middlewares/isAuth";
import { ApiContext } from "../types/ApiContext";

@Resolver()
export class Me {
  @UseMiddleware(isAuth)
  @Query(() => User)
  async me(@Ctx() ctx: ApiContext): Promise<User> {
    if (!ctx.payload) {
      throw new Error();
    }

    const userId = ctx.payload.user.id;

    const me = await User.findOne({ where: { id: userId } });

    if (!me) {
      throw new Error();
    }

    return me;
  }
}
