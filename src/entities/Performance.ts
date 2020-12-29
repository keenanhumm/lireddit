import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Performance {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  areaId!: number;

  @Field()
  @Property()
  userId!: number;

  @Field()
  @Property()
  rating!: number;

  @Field()
  @Property({ type: "text"})
  day!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

}