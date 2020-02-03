import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class LoginParams {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(10, 25)
  password: string;
}
