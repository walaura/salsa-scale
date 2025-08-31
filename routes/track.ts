import { Collection, MongoClient } from "mongodb";
import type { LogEntry } from "../app/db.ts";

const uri = process.env.MONGO_URL as string;

const detectFeedingEventOfSize = async ({
  logs,
  weight,
}: {
  logs: Collection<LogEntry>;
  weight: number;
}) => {
  const twoPrior = [];
  for await (const doc of logs.find().sort({ timestamp: -1 }).limit(2)) {
    twoPrior.push(doc);
  }

  if (twoPrior.length !== 2) {
    return null;
  }
  if (twoPrior[0].feedingEventOfSize != null) {
    return null;
  }
  const largestWeight = Math.max(
    twoPrior[0]?.weight || 0,
    twoPrior[1]?.weight || 0
  );
  const delta = largestWeight - weight;
  if (delta < 3) {
    return null;
  }

  return delta;
};

const getTimeSinceLastFeedingEvent = async ({
  logs,
}: {
  logs: Collection<LogEntry>;
}) => {
  const lastFeedingEvent = await logs
    .find({ feedingEventOfSize: { $ne: null } })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  if (!lastFeedingEvent[0]) {
    return null;
  }
  return Date.now() - lastFeedingEvent[0].timestamp;
};

async function trackRoute({
  weight,
  timestamp,
}: {
  weight: number;
  timestamp: number;
}) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("default");
    const logs = database.collection<LogEntry>("logs");

    const feedingEventOfSize = await detectFeedingEventOfSize({ logs, weight });
    const timeSinceLastFeedingEvent = await (feedingEventOfSize == null
      ? null
      : getTimeSinceLastFeedingEvent({
          logs,
        }));

    if (timeSinceLastFeedingEvent) {
      console.log(
        `Time since last feeding event: ${Math.round(
          timeSinceLastFeedingEvent / (1000 * 60)
        )} minutes`
      );
      // TODO email if severe
    }

    const result = await logs.insertOne({
      weight,
      timestamp,
      feedingEventOfSize,
    });
    const response = `New log entry created with the following id: ${result.insertedId}`;
    console.log(response);

    return response;
  } finally {
    await client.close();
  }
}

export { trackRoute };
