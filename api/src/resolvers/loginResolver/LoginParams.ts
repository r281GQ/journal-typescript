import { IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class LoginParams {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
