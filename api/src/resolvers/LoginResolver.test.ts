import { Connection } from "typeorm";

import { testConn } from "../test-utils/testConn";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn(true);
});

afterAll(async () => {
  await conn.close();
});

describe("loginResolver", () => {
  test("test", () => {});
});
