import { User } from '../entities/User';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import UserCredentials from '../models/UserCredentials';
import UserResponse from '../models/UserResponse';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext,
  ): Promise<User | null> {
    const { session: { userId: id }} = req;
    // caller is not logged in
    if (!id) return null;

    return await em.findOne(User, { id });
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em, req }: MyContext,
    @Arg('credentials') { username, password }: UserCredentials,
  ): Promise<UserResponse> {
    // input validation
    if (username.length < 4) {
      return {
        errors: [
          {
            field: 'username',
            message: "must be at least 4 characters long",
          },
        ],
      };
    }
    if (password.length < 4) {
      return {
        errors: [
          {
            field: 'password',
            message: "must be at least 4 characters long",
          },
        ],
      };
    }
    // hash pwd
    const hashedPwd = await argon2.hash(password);

    // create user
    const user = em.create(User, {
      username,
      password: hashedPwd,
    });
    // persist user
    try {
      await em.persistAndFlush(user);
    } catch ({ code }) {
      if (code === '23505') {
        // user already exists
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req }: MyContext,
    @Arg('credentials') { username, password }: UserCredentials,
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username,
    });

    // check if user with that username was found
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "user does not exist!",
          },
        ],
      };
    }

    // verify password provided was correct
    const validPwd = await argon2.verify(user.password, password);
    if (!validPwd) {
      return {
        errors:[
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}