import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
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

async function sendMail(url: string) {
  "use strict";

  // async..await is not allowed in global scope, must use a wrapper
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello world?
    
    
    <a href="${url}">link is here </a>
    
    
    
    </b>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
