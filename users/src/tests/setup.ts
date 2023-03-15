import createServer from "../app";
import dotenv from "dotenv";
import * as db from "./dbHandler";
//const server = createServer();

dotenv.config();

/* Connecting to the database before all test. */
beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  //await db.clearDatabase();
});
/* Closing database connection after each test. */
afterEach(async () => {
  // await db.clearDatabase();
});

/* Destroy collection connection after all test. */
afterAll(async () => {
  await db.closeDatabase();
});
