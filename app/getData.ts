import { type Collection } from "mongodb";
import { withDb, type LogEntry } from "./setup/db.ts";

export const getPreviousFeedingEvents = async ({
  logs,
}: {
  logs: Collection<LogEntry>;
}) => {
  const previousFeedingEvents = await logs
    .find()
    .limit(6)
    .sort({ timestamp: -1 })
    .toArray();
  return previousFeedingEvents;
};

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
