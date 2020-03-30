import { graphql, GraphQLSchema, ExecutionResult } from "graphql";
import { buildSchema } from "type-graphql";

import { CreateUser } from "../resolvers/CreateUserResolver";
import { LoginResolver } from "../resolvers/LoginResolver";
import { CreateEntry } from "../resolvers/CreateEntryResolver";

interface Options<Y = {}> {
  source: string;
  variableValues?: Y;
  contextValue?: any;
}

let schema: GraphQLSchema;

async function getSchema() {
  schema = await buildSchema({
    resolvers: [CreateUser, LoginResolver, CreateEntry]
  });
}

export async function executeGraphQL<T = {}, Y = {}>({
  source,
  variableValues,
  contextValue
}: Options<Y>): Promise<ExecutionResult<T>> {
  await getSchema();

  let mockedContext = {
    res: {
      cookie: jest.fn()
    },
    req: {}
  };

  if (contextValue) {
    mockedContext = contextValue;
  }

  return graphql<T>({
    schema,
    source,
    variableValues,
    contextValue: mockedContext
  });
}
