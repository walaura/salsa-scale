import { Db, MongoClient } from "mongodb";
import { MONGO_URL } from "./env.ts";

export interface LogEntry {
  weight: number;
  timestamp: number;
  feedingEventOfSize?: number | null;
}

export const getDbClient = () => new MongoClient(MONGO_URL);
export const withDb = async <T>(fn: (db: Db) => Promise<T>) => {
  const client = getDbClient();
  try {
    return await fn(client.db("default"));
  } finally {
    await client.close();
  }
};
