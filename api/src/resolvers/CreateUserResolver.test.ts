import { Connection } from "typeorm";

import { testConn } from "../../test-utils/testConn";
import { gCall } from "../../test-utils/gCall";
import { User } from "../entities/User";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn(true);
});

beforeEach(async cb => {
  await conn.query(`DELETE FROM "user";`);

  cb();
});

afterAll(async () => {
  await conn.close();
});

const createUserMutation = `
mutation createUser($data: CreateUserParams!) {
  createUser(
    data: $data
  ) {
    token
  }
}
`;

describe(createUserMutation, () => {
  test("creates user and gives back a token", async () => {
    const result: any = await gCall({
      source: createUserMutation,
      variableValues: {
        data: {
          lastName: "sdfsd",
          firstName: "sdfsd",
          password: "sdfsdfsdfsdfsdfsd",
          email: "sdkfljsdkf@klxdjfls.com"
        }
      }
    });

    expect(result.data.createUser.token).not.toBeUndefined();
    expect(typeof result.data.createUser.token).toBe("string");
  });

  test("creates user and persists the correct values to the database", async () => {
    const email = "sdkfljsdkf@klxdjfls.com";
    const result: any = await gCall({
      source: createUserMutation,
      variableValues: {
        data: {
          lastName: "sdfsd",
          firstName: "sdfsd",
          password: "sdfsdfsdfsdfsdfsd",
          email: "sdkfljsdkf@klxdjfls.com"
        }
      }
    });

    const user = await User.findOne({ where: { email } });

    expect(user?.email).toMatch(email);

    expect(result.data.createUser.token).not.toBeUndefined();
    expect(typeof result.data.createUser.token).toBe("string");
  });
});
