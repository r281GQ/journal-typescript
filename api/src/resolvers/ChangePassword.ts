import bcrypt from "bcrypt";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware
} from "type-graphql";

import { User } from "../entities/User";
import { SALT } from "../Environment";
import { isAuth } from "../middlewares/isAuth";
import { ApiContext } from "../types/ApiContext";

@InputType()
class ChangePasswordInput {
  @Field({ description: `The user's current password.` })
  currentPassword: string;
  @Field({ description: `The password to be set.` }) newPassword: string;
}

@Resolver()
export class ChangePassword {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, {
    description: `Use it to change the user's password when he/she is logged in.`
  })
  async changePassword(
    @Arg("changePasswordParams") changePasswordParams: ChangePasswordInput,
    @Ctx() ctx: ApiContext
  ): Promise<boolean> {
    const { currentPassword, newPassword } = changePasswordParams;

    try {
      const user = await User.findOne({ where: { id: ctx.payload?.user.id } });

      if (!user) {
        throw new Error();
      }

      const passwordFromDb = user.password;

      const isValid = await bcrypt.compare(currentPassword, passwordFromDb);

      if (isValid) {
        const hashedPassword = await bcrypt.hash(newPassword, SALT);

        user.password = hashedPassword;

        await user.save();
      }

      return true;
    } catch (e) {
      throw false;
    }
  }
}
