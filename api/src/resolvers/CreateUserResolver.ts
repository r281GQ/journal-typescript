import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Query, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";

import { User, Role } from "../entities/User";
import { CreateUserParams } from "./createUserResolver/CreateUserParams";
import { SALT } from "../Environment";
import { isAuth } from "../middlewares/isAuth";
import { JWT } from "./shared/JWT";
import { createAccessToken } from "../utils/CreateAccessToken";
import { createUrl } from "../utils/CreateUrl";
import { getRedis } from "../utils/Redis";
import { sendMail } from "../utils/SendMail";

@Resolver()
export class CreateUser {
  @UseMiddleware(isAuth)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => JWT)
  async createUser(@Arg("data") data: CreateUserParams): Promise<JWT> {
    try {
      const { firstName, lastName, email, password, admin } = data;

      const hashedPasswrod = await bcrypt.hash(password, SALT);

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

      const uu = v4();

      const redis = getRedis();

      await redis.set(uu, `${id}`);

      const url = createUrl(`/verify_email/${uu}`);

      sendMail(url);

      return { token };
    } catch (e) {
      throw e;
    }
  }
}
