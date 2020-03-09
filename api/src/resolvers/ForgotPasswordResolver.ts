import { IsEmail } from "class-validator";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";

import { User } from "../entities/User";
import { createUrl } from "../utils/CreateUrl";
import { sendMail } from "../utils/SendMail";
import { getRedis } from "../utils/Redis";

@InputType()
class ForgotPasswordInput {
  @IsEmail() @Field() email: string;
}

@Resolver()
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("forgotPasswordParams") forgotPasswordParams: ForgotPasswordInput
  ): Promise<boolean> {
    const { email } = forgotPasswordParams;

    try {
      const user = await User.findOne({ where: { email } });

      const token = v4();

      if (!user) {
        throw new Error();
      }

      const redis = getRedis();

      await redis.set(token, email, "ex", 60 * 60);

      const url = createUrl(`/reset_password?token=${token}`);

      await sendMail(url);

      return true;
    } catch (e) {
      return false;
    }
  }
}
