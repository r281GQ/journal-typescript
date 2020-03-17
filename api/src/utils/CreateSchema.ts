import { buildSchema } from "type-graphql";

import { ChangePassword } from "../resolvers/ChangePassword";
import { CreateUser } from "../resolvers/CreateUserResolver";
import { ForgotPassword } from "../resolvers/ForgotPasswordResolver";
import { LoginResolver } from "../resolvers/LoginResolver";
import { LogoutResolver } from "../resolvers/LogoutResolver";
import { Me } from "../resolvers/MeResolver";
import { ResetPassword } from "../resolvers/ResetPasswordResolver";
import { SendMail } from "../resolvers/SendEmailResolver";
import { VerifyEmail } from "../resolvers/VerifyEmailResolver";

export const createSchema = async () => {
  const mutations = [
    ChangePassword,
    CreateUser,
    ForgotPassword,
    LoginResolver,
    LogoutResolver,
    ResetPassword,
    SendMail,
    VerifyEmail
  ];

  const queries = [Me];

  const schema = await buildSchema({
    resolvers: [...queries, ...mutations]
  });

  return schema;
};
