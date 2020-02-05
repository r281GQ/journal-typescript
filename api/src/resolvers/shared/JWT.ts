import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class JWT {
  @Field()
  token: string;
}
