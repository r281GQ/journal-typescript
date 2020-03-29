import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class CreateUserParams {
  @Field({ nullable: true, defaultValue: false })
  admin?: boolean;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  password: string;
}
