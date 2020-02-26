import bcrypt from "bcrypt";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  Ctx
} from "type-graphql";

import { User, Role } from "../entities/User";
import { CreateUserParams } from "./createUserResolver/CreateUserParams";
import { SALT } from "../Environment";
import { createAccessToken } from "../utils/CreateAccessToken";
import { JWT } from "./shared/JWT";
import { isAuth } from "../middlewares/isAuth";
import { ApiContext } from "../types/ApiContext";
import { Payload } from "../types/Payload";

@Resolver()
export class CreateUser {
  @UseMiddleware(isAuth)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => JWT)
  async createUser(
    @Arg("data") data: CreateUserParams,
    @Ctx() ctx: ApiContext
  ): Promise<JWT> {
    try {
      const { firstName, lastName, email, password, admin } = data;

      const hashedPasswrod = await bcrypt.hash(password, SALT);

      console.log(ctx);

      const d: Payload | null = null;

      console.log(d);

      const values = {
        firstName,
        lastName,
        email,
        password: hashedPasswrod
      } as any;

      if (admin) {
        values.role = Role.ADMIN;
      }

      const entity = User.create(values);

      User.create(values);

      const { id, role } = await entity.save();

      const token = createAccessToken({ user: { id, role } });

      return { token };
    } catch (e) {
      throw e;
    }
  }
}
