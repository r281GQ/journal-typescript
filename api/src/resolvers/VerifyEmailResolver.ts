import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../entities/User";
import { getRedis } from "../utils/Redis";

@Resolver()
export class VerifyEmail {
  @Mutation(() => Boolean)
  async verifyEmail(@Arg("token") token: string): Promise<boolean> {
    try {
      const redis = getRedis();

      const userId = await redis.get(token);

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return false;
      }

      user.verified = true;

      await user.save();

      await redis.del(token);

      return true;
    } catch (e) {
      return false;
    }
  }
}
