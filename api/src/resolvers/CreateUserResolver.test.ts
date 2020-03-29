import { Connection } from "typeorm";

import { testConn } from "../test-utils/testConn";
import { executeGraphQL } from "../test-utils/gCall";
import { User } from "../entities/User";
import { sendMail } from "./../utils/SendMail";
import { getRedis } from "./../utils/Redis";

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

jest.mock("../utils/SendMail.ts", () => {
  return {
    esModule: true,
    sendMail: jest.fn()
  };
});

jest.mock("../utils/Redis.ts", () => {
  let client = {
    set: jest.fn()
  };

  return {
    getRedis: () => {
      return client;
    }
  };
});

describe(createUserMutation, () => {
  test("creates user and gives back a token", async () => {
    const result: any = await executeGraphQL({
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

  test.only("sends email", async () => {
    let context = {
      res: {
        cookie: jest.fn()
      },
      req: {}
    };
    const result: any = await executeGraphQL({
      source: createUserMutation,
      variableValues: {
        data: {
          lastName: "sdfsd",
          firstName: "sdfsd",
          password: "sdfsdfsdfsdfsdfsd",
          email: "sdkfljsdkf@klxdjfls.com"
        }
      },
      contextValue: context
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.stringMatching(/\/emailverification\?token/)
    );

    expect(context.res.cookie).toHaveBeenCalledWith(
      "jid",
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );

    expect(getRedis().set).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );

    expect(result.data.createUser.token).not.toBeUndefined();
    expect(typeof result.data.createUser.token).toBe("string");
  });

  test("creates user and persists the correct values to the database", async () => {
    const email = "sdkfljsdkf@klxdjfls.com";
    const result: any = await executeGraphQL({
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
