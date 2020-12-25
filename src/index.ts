import { MikroORM } from '@mikro-orm/core';
import "reflect-metadata";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from './resolvers/UserResolver';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { isProd } from './constants';
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  // create and configure redis client
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 yrs,
        httpOnly: true,
        secure: isProd, // using https for prod only
        sameSite: 'lax',
      },
      secret: 'fjdsljfkldsjfklsj',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // configure and apply graphql middleware
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
   });

  app.get('/', (_req, res) => {
    res.send('hello');
  });
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });

};

main().catch(err => {
  console.error({ err });
});
