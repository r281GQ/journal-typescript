import {
  Mutation,
  Resolver,
  InputType,
  Arg,
  Field,
  UseMiddleware
} from "type-graphql";

import { isAuth } from "../../middlewares/isAuth";
import { Entry } from "../../entities/Entry";
import {
  ArrayNotEmpty,
  ArrayMaxSize,
  IsNotEmpty,
  MinLength,
  MaxLength
} from "class-validator";

@InputType()
class CreateEntryParams {
  @Field()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @Field()
  @IsNotEmpty()
  body: string;

  @Field(() => [String])
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  tags: string[];
}

@Resolver()
export class CreateEntry {
  @UseMiddleware(isAuth)
  @Mutation(() => Entry)
  async createEntry(@Arg("data") data: CreateEntryParams): Promise<Entry> {
    try {
      const entry = new Entry();

      entry.body = data.body;
      entry.title = data.title;
      entry.tags = data.tags;

      const result = await entry.save();

      return result;
    } catch (e) {
      throw e;
    }
  }
}
