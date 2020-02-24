import { graphql, GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Maybe from "graphql/tsutils/Maybe";

import { CreateUser } from "./../src/resolvers/CreateUserResolver";
import { LoginResolver } from "./../src/resolvers/LoginResolver";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

async function getSchema() {
  schema = await buildSchema({
    resolvers: [CreateUser, LoginResolver]
  });
}

export async function gCall<T>({ source, variableValues }: Options) {
  await getSchema();

  return graphql<T>({
    schema,
    source,
    variableValues
  });
}
