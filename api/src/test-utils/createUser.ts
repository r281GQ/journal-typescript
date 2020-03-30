import faker from "faker";

import { CreateUserParams } from "../resolvers/createUserResolver/CreateUserParams";
import { JWT } from "../resolvers/shared/JWT";
import { executeGraphQL } from "../test-utils/gCall";

export const createUser = async () => {
  const source = `
      mutation createUser($data: CreateUserParams!) {
        createUser(
          data: $data
        ) {
          token
        }
      }`;

  const createUserResult = await executeGraphQL<
    { createUser: JWT },
    { data: CreateUserParams }
  >({
    source,
    variableValues: {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
  });

  if (createUserResult.data) {
    return createUserResult.data.createUser.token;
  }

  throw "something went wrong";
};
