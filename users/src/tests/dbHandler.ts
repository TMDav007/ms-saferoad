import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = MongoMemoryServer.create();

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  const uri = await (await mongod).getUri();
  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await mongod).stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
