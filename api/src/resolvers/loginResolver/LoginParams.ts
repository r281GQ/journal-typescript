import { IsEmail, MinLength, Length } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class LoginParams {
  @Field()
  @IsEmail()
  @MinLength(10)
  email: string;

  @Field()
  @Length(10, 20)
  password: string;
}
