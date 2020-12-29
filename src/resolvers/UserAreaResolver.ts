import { UserArea } from "../entities/UserArea";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";

@Resolver()
export class UserAreaResolver {
  @Query(() => [UserArea])
  areas(
    @Ctx() { em, req }: MyContext,
  ): Promise<UserArea[]> {
    const { userId } = req.session;

    return em.find(UserArea, { userId, isActive: true });
  }

  @Query(() => UserArea, { nullable: true })
  area(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number,
  ): Promise<UserArea | null> {
    return em.findOne(UserArea, { id });
  }

  @Mutation(() => UserArea)
  async createUserArea(
    @Ctx() { em, req }: MyContext,
    @Arg("name") name: string,
  ): Promise<UserArea> {
    // use current user for userId
    const { userId } = req.session;

    const result = await (em as EntityManager).createQueryBuilder(UserArea).getKnexQuery().insert({
      user_id: userId,
      name,
      is_active: true,
    }).returning("*");

    const area = result.map(e => em.map(UserArea, e))[0];

    return area;
  }

  @Mutation(() => UserArea, { nullable: true})
  async updateUserArea(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number,
    @Arg("name", () => String, { nullable: true}) name: string | null,
    @Arg("isActive", () => Boolean, { nullable: true}) isActive: boolean | null,
  ): Promise<UserArea | null> {

    // look for area by id
    const area = await em.findOne(UserArea, {
      id,
    });
    // return null if not found
    if (!area) return null;

    // assign new values where necessary
    area.name = typeof name === "string" ? name : area.name;
    area.isActive = typeof isActive === "boolean" ? isActive : area.isActive;

    await em.persistAndFlush(area);

    return area;
  }

  @Mutation(() => Boolean)
  async deleteUserArea(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number,
  ): Promise<boolean> {
    await em.nativeDelete(UserArea, {
      id,
    });
    return true;
  }
}