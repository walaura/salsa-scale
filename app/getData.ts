import { withDb, type LogEntry } from "./setup/db.ts";

const getAllData = async ({ daysToFetch }: { daysToFetch: number }) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    const all = await logs
      .find()
      .sort({ timestamp: -1 })
      .limit(6 * 24 * daysToFetch)
      .toArray();
    return all;
  });

export { getAllData };
