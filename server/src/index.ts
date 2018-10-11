import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typedef';
import { resolvers } from './resolver';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as session from 'express-session';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({ req })
  });

  await createConnection();

  const app = express();
  const path = '/graphql';

  app.use(
    session({
      secret: 'password',
      resave: false,
      saveUninitialized: false
    })
  );

  server.applyMiddleware({ app, path });

  app.listen({ port: 4000 }, () => {
    console.log(`server running at localhost:4000${server.graphqlPath}`);
  });
};

startServer();
