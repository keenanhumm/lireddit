import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class UserArea {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  userId!: number;

  @Field()
  @Property({ type: "text" })
  name: string;

  @Field()
  @Property({ type: "boolean" })
  isActive: boolean;

}