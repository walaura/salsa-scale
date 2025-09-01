import { Collection, MongoClient } from "mongodb";
import type { LogEntry } from "../app/db.ts";

const FEEDING_EVENT_THRESHOLD = 4;

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
  const largestWeight = Math.max(
    twoPrior[0]?.weight || 0,
    twoPrior[1]?.weight || 0
  );
  const delta = largestWeight - weight;
  if (delta < FEEDING_EVENT_THRESHOLD) {
    return null;
  }

  return delta;
};

const getPreviousFeedingEvent = async ({
  logs,
}: {
  logs: Collection<LogEntry>;
}) => {
  const previousFeedingEvents = await logs
    .find({ feedingEventOfSize: { $ne: null } })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  if (!previousFeedingEvents[0]) {
    return null;
  }
  return previousFeedingEvents[0];
};

const maybeCombineFeedingEvent = async ({
  maybeFeedingEventOfSize,
  logs,
}: {
  maybeFeedingEventOfSize: number | null;
  logs: Collection<LogEntry>;
}): Promise<number | null> => {
  if (maybeFeedingEventOfSize == null) {
    return null;
  }

  const previousFeedingEvent = await getPreviousFeedingEvent({ logs });
  /* db empty? */
  if (
    previousFeedingEvent == null ||
    previousFeedingEvent.feedingEventOfSize == null
  ) {
    return maybeFeedingEventOfSize;
  }

  const timeSincePreviousFeedingEvent =
    Date.now() - previousFeedingEvent.timestamp;

  console.log(
    `Time since last feeding event: ${Math.round(
      timeSincePreviousFeedingEvent / (1000 * 60)
    )} minutes`
  );
  // TODO email if severe

  /* short snack? delete previous feeding event and make this one bigger */
  if (timeSincePreviousFeedingEvent < 1000 * 60 * 21) {
    console.log(
      previousFeedingEvent.feedingEventOfSize,
      maybeFeedingEventOfSize
    );
    console.log("Short snack detected");
    await logs.updateOne(
      { _id: previousFeedingEvent._id },
      {
        $set: {
          feedingEventOfSize: null,
        },
      }
    );
    return (
      previousFeedingEvent.feedingEventOfSize +
      previousFeedingEvent.weight -
      maybeFeedingEventOfSize
    );
  }
  return maybeFeedingEventOfSize;
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

    let maybeFeedingEventOfSize = await detectFeedingEventOfSize({
      logs,
      weight,
    });
    maybeFeedingEventOfSize = await maybeCombineFeedingEvent({
      maybeFeedingEventOfSize,
      logs,
    });

    const result = await logs.insertOne({
      weight,
      timestamp,
      feedingEventOfSize: maybeFeedingEventOfSize,
    });
    const response = `New log entry created with the following id: ${result.insertedId}`;
    console.log(response);

    return response;
  } finally {
    await client.close();
  }
}

export { trackRoute };
