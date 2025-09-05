import { Collection } from "mongodb";
import { withDb, type LogEntry } from "../app/setup/db.ts";
import { isFeedingEvent as isFeedingEventFn } from "../app/feedingEvent.ts";

const detectFeedingEventOfSize = async ({
  logs,
  weight,
}: {
  logs: Collection<LogEntry>;
  weight: number;
}): Promise<number | null> => {
  const twoPrior = await getPreviousFeedingEvents({ logs });

  if (twoPrior.length !== 2) {
    console.log(`Missing events`);
    return null;
  }
  const [isFeedingEvent, delta] = isFeedingEventFn(weight, [
    twoPrior[0],
    twoPrior[1],
  ]);

  if (!isFeedingEvent) {
    console.log(
      `Not a feeding event (${weight}, ${twoPrior[0].weight}, ${twoPrior[1].weight})`
    );
    return null;
  }

  //clean up the previous ones if they were set
  for await (const prior of twoPrior) {
    if (prior.feedingEventOfSize == null) {
      continue;
    }
    console.log(`
      Cleaning up previous feeding event ${prior._id} to merge with new event of size ${delta}`);
    await logs.updateOne(
      { _id: prior._id },
      {
        $set: {
          feedingEventOfSize: null,
        },
      }
    );
  }

  console.log(`
      Marking as feeding event of size ${delta}`);

  return delta;
};

const getPreviousFeedingEvents = async ({
  logs,
}: {
  logs: Collection<LogEntry>;
}) => {
  const previousFeedingEvents = await logs
    .find()
    .limit(2)
    .sort({ timestamp: -1 })
    .toArray();
  return previousFeedingEvents;
};

async function trackRoute({
  weight,
  timestamp,
}: {
  weight: number;
  timestamp: number;
}) {
  return withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");

    const feedingEventOfSize = await detectFeedingEventOfSize({
      logs,
      weight,
    });

    const result = await logs.insertOne({
      weight,
      timestamp,
      feedingEventOfSize,
    });
    const response = `New log entry created with the following id: ${result.insertedId}`;
    console.log(response);

    return response;
  });
}

export { trackRoute };
