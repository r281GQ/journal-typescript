import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

registerEnumType(Role, {
  name: "Role"
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { default: "USER" })
  @Field(() => Role)
  role: Role;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column("boolean", { default: false })
  @Field()
  verified: boolean;
}
