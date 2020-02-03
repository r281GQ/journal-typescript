import bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Query } from "type-graphql";

import { User } from "../entities/User";
import { CreateUserParams } from "./createUserResolver/CreateUserParams";
import { SALT } from "../Environment";

@Resolver()
export class CreateUser {
  @Query(() => String)
  hello(): string {
    return "";
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserParams): Promise<User | null> {
    const { firstName, lastName, email, password } = data;

    const hashedPasswrod = await bcrypt.hash(password, SALT);

    const entity = User.create({
      firstName,
      lastName,
      email,
      password: hashedPasswrod
    });

    const user = await entity.save();

    return user;
  }
}
