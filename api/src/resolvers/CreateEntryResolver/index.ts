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

export const ERROR_MESSAGE_TITLE_REQUIRED = "hey, please write something";
export const ERROR_MESSAGE_TITLE_MIN = "should be a bit longer than that";
export const ERROR_MESSAGE_TITLE_MAX =
  "writing a novel? please make it shorter";

export const ERROR_MESSAGE_BODY_REQUIRED = "hey, please write something";

export const ERROR_MESSAGE_TAGS_REQUIRED = "please, select at least one";
export const ERROR_MESSAGE_TAGS_MAX = "please, have at most three";

@InputType()
class CreateEntryParams {
  @Field()
  @MinLength(2, { message: ERROR_MESSAGE_TITLE_MIN })
  @MaxLength(50, { message: ERROR_MESSAGE_TITLE_MAX })
  title: string;

  @Field()
  @IsNotEmpty({ message: ERROR_MESSAGE_BODY_REQUIRED })
  body: string;

  @Field(() => [String])
  @ArrayNotEmpty({ message: ERROR_MESSAGE_TAGS_REQUIRED })
  @ArrayMaxSize(3, { message: ERROR_MESSAGE_TAGS_MAX })
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
