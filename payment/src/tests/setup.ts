import * as db from "./dbHandler";

require("dotenv").config(".env");


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
