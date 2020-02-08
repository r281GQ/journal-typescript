import bcrypt from "bcrypt";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  MiddlewareFn
} from "type-graphql";

import { User, Role } from "../entities/User";
import { CreateUserParams } from "./createUserResolver/CreateUserParams";
import { SALT } from "../Environment";
import { ApiContext } from "../types/ApiContext";
import { createAccessToken } from "../utils/CreateAccessToken";
import { JWT } from "./shared/JWT";

export const isAdmin: MiddlewareFn<ApiContext> = async (
  { args, info, context, root },
  next
) => {
  const header = context.req.headers["authorization"];

  let bearer = header?.split(" ")[1];

  return next();
};

@Resolver()
export class CreateUser {
  @UseMiddleware(isAdmin)
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

      const { id, role } = await entity.save();

      const token = createAccessToken({ user: { id, role } });

      return { token };
    } catch (e) {
      throw e;
    }
  }
}
