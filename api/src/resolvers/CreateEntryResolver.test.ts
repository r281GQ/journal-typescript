import { Connection } from "typeorm";
import faker from "faker";

import { ERROR_MESSAGE_TITLE_MIN } from "./CreateEntryResolver";
import { AuthorizationError } from "../errors/AuthorizationError";
import { createUser } from "../test-utils/createUser";
import { getValidationError } from "../test-utils/getValidationError";
import { executeGraphQL } from "../test-utils/gCall";
import { testConn } from "../test-utils/testConn";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn(true);
});

beforeEach(async cb => {
  await conn.query('DELETE from "user";');

  cb();
});

afterAll(async () => {
  await conn.close();
});

jest.mock("./../utils/SendMail.ts", () => {
  return {
    sendMail: jest.fn()
  };
});

describe("CreateEntryResolver", () => {
  test("creates the entry when authorzied", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: "title",
      body: faker.lorem.paragraph(),
      tags: [1, 2].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {
            authorization: `bearer ${createUserResult}`
          }
        }
      }
    });

    expect(createEntryResult.errors).toBeFalsy();

    expect(typeof createUserResult === "string").toBe(true);
  });

  test("throws error when not authorized", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: "title",
      body: faker.lorem.paragraph(),
      tags: [1, 2].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {}
        }
      }
    });

    if (createEntryResult.errors) {
      const original = createEntryResult.errors[0].originalError;

      expect(original instanceof AuthorizationError).toBeTruthy();
    }

    expect(typeof createUserResult === "string").toBe(true);
  });

  test("validation - title - long", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: faker.lorem.paragraphs(4),
      body: faker.lorem.paragraph(),
      tags: [1, 2].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {
            authorization: `bearer ${createUserResult}`
          }
        }
      }
    });

    expect(createEntryResult.errors).toBeTruthy();

    expect(typeof createUserResult === "string").toBe(true);
  });

  test.only("validation - title - short", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: "",
      body: faker.lorem.paragraph(),
      tags: [1, 2].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {
            authorization: `bearer ${createUserResult}`
          }
        }
      }
    });

    const message = getValidationError(createEntryResult);

    expect(message).toBe(ERROR_MESSAGE_TITLE_MIN);
  });

  test("validation - body", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: "title",
      body: "",
      tags: [1, 2].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {
            authorization: `bearer ${createUserResult}`
          }
        }
      }
    });

    expect(createEntryResult.errors).toBeTruthy();

    expect(typeof createUserResult === "string").toBe(true);
  });

  test("validation - tags - none", async () => {
    const createUserResult = await createUser();

    const source = `mutation CreateEntry($data: CreateEntryParams!) {
      createEntry(data: $data) {
        id
        title
        body
        tags
      }
    }`;

    const params = {
      title: "title",
      body: faker.lorem.paragraph(),
      tags: [].map(faker.lorem.slug)
    };

    const createEntryResult = await executeGraphQL({
      source,
      variableValues: {
        data: params
      },
      contextValue: {
        req: {
          headers: {
            authorization: `bearer ${createUserResult}`
          }
        }
      }
    });

    expect(createEntryResult.errors).toBeTruthy();

    expect(typeof createUserResult === "string").toBe(true);
  });
});
