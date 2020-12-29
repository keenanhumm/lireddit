import { Performance } from "../entities/Performance";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PerformanceResolver {
  // @Query(() => [Performance])
  // async searchPerformances(
  //   @Ctx() { em }: MyContext,
  //   @Arg("startDate", () => Date) startDate: Date,
  //   @Arg("endDate", () => Date) endDate: Date,
  // ): Promise<Performance[]> {
  //   return await em.find(Performance, { $and: [
  //     { "createdAt >=": startDate },
  //     { "createdAt <=": endDate },
  //   ] });
  // }

  @Query(() => [Performance], { nullable: true })
  async performances(
    @Ctx() { em, req }: MyContext,
    @Arg("day", () => String, { nullable: true}) day: string | null,
  ): Promise<Performance[] | null> {
    // current user id from session
    const { userId } = req.session;
    // get date string for today
    const today = new Date().toDateString();

    return await em.find(Performance, {
      day: day || today, // use today if date not provided
      userId,
    });
  }

  @Query(() => Performance, { nullable: true })
  async performance(
    @Ctx() { em, req }: MyContext,
    @Arg("day", () => String, { nullable: true}) day: string | null,
    @Arg("areaId") areaId: number,
  ): Promise<Performance | null> {
    // current user id from session
    const { userId } = req.session;
    // get date string for today
    const today = new Date().toDateString();

    return await em.findOne(Performance, {
      day: day || today, // use today if date not provided
      userId,
      areaId,
    });
  }

  @Mutation(() => Performance)
  async logPerformance(
    @Ctx() { em, req }: MyContext,
    @Arg("areaId") areaId: number,
    @Arg("rating") rating: number,
  ): Promise<Performance> {
    // use current user id for userId
    const { userId } = req.session;
    // use today as day
    const day = new Date().toDateString();

    // look for existing performance for today
    let performance = await em.findOne(Performance, { day, areaId });

    if (!performance) {
      // create record
      performance = em.create(Performance, {
        day,
        userId,
        areaId,
        rating,
      });
    } else {
      // update record
      performance.rating = rating;
    }


    // persist
    await em.persistAndFlush(performance);

    // return record
    return performance;
  }

  // @Mutation(() => Boolean)
  // async deletePerformance(
  //   @Ctx() { em }: MyContext,
  //   @Arg("id") id: number,
  // ): Promise<boolean> {
  //   await em.nativeDelete(Performance, {
  //     id,
  //   });
  //   return true;
  // }
}