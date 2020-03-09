import bcrypt from "bcrypt";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";

import { User } from "../entities/User";
import { SALT } from "../Environment";
import { getRedis } from "../utils/Redis";

@InputType()
class ResetPasswordInput {
  @Field({ description: `The password to be set.` }) newPassword: string;
  @Field({
    description: `Token from the sent email which identifies the user and the password reset request.`
  })
  token: string;
}

@Resolver()
export class ResetPassword {
  @Mutation(() => Boolean, {
    description: `Use it to change the user's password without logging in.`
  })
  async resetPassword(
    @Arg("resetPasswordParams") resetPasswordParams: ResetPasswordInput
  ): Promise<boolean> {
    const { newPassword, token } = resetPasswordParams;

    const hashedPasswrod = await bcrypt.hash(newPassword, SALT);
    try {
      const redis = getRedis();

      const email = await redis.get(token);

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error();
      }

      user.password = hashedPasswrod;

      await user.save();

      await redis.del(token);

      return true;
    } catch (e) {
      return false;
    }
  }
}
