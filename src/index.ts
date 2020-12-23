import { MikroORM } from '@mikro-orm/core';
import "reflect-metadata";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/posts';


const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({
      em: orm.em,
    }),
  });

  apolloServer.applyMiddleware({ app });

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
