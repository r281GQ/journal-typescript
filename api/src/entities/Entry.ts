import { Field, ObjectType, ID } from "type-graphql";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  body: string;

  @Field(() => [String])
  @Column({ type: "simple-array" })
  tags: string[];
}
