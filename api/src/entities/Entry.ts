import { Field, ObjectType, ID } from "type-graphql";
import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field(() => [String])
  tags: string[];
}
