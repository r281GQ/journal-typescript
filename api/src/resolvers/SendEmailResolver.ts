import { Resolver, UseMiddleware, Ctx, Mutation } from "type-graphql";
import { v4 } from "uuid";

import { isAuth } from "../middlewares/isAuth";
import { ApiContext } from "../types/ApiContext";
import { getRedis } from "../utils/Redis";
import { createUrl } from "../utils/CreateUrl";
import { sendMail } from "../utils/SendMail";

@Resolver()
export class SendMail {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, {})
  async sendMail(@Ctx() ctx: ApiContext): Promise<boolean> {
    if (!ctx.payload) {
      throw new Error();
    }

    const uu = v4();

    const redis = getRedis();

    await redis.set(uu, `${ctx.payload.user.id}`);

    const url = createUrl(`/verify_email/${uu}`);

    await sendMail(url);

    return true;
  }
}
