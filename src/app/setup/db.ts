import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { MONGO_URL } from "./env.ts";

export interface LogEntry {
  weight: number;
  timestamp: number;
  feedingEventOfSize?: number | null;
}

export interface EmailEntry {
  weight: number;
  sentAt: number;
  feedingEventId?: ObjectId;
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

export const withDbLogs = async <T>(
  fn: (logs: Collection<LogEntry>) => Promise<T>,
) =>
  withDb((db) => {
    const logs = db.collection<LogEntry>("logs");
    return fn(logs);
  });
