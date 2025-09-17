import { Collection } from "mongodb";
import { withDb, type LogEntry } from "../app/setup/db.ts";
import { isFeedingEvent as isFeedingEventFn } from "../app/feedingEvent.ts";
import { getPreviousFeedingEvents } from "../app/getData.ts";
import { formatGrams } from "../app/format.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { Route } from "@/app/setup/routes.ts";

const detectFeedingEventOfSize = async ({
  logs,
  weight,
}: {
  logs: Collection<LogEntry>;
  weight: number;
}): Promise<number | null> => {
  const lastHour = await getPreviousFeedingEvents({ logs });

  if (lastHour.length <= 2) {
    console.log(`Missing events`);
    return null;
  }

  const [isFeedingEvent, delta] = isFeedingEventFn(
    weight,
    lastHour.map((e) => e.weight),
  );

  if (!isFeedingEvent) {
    console.log(
      `Not a feeding event (${weight} - ${lastHour
        .map((e) => e.weight)
        .join(", ")})`,
    );
    return null;
  }

  //clean up the previous ones if they were set
  for await (const prior of lastHour) {
    if (prior.feedingEventOfSize == null) {
      continue;
    }
    console.log(
      `Cleaning up previous feeding event ${prior._id} to merge with new event of size ${delta}`,
    );
    await logs.updateOne(
      { _id: prior._id },
      {
        $set: {
          feedingEventOfSize: null,
        },
      },
    );
  }
  console.log(`Marking as feeding event of size ${delta}`);

  return delta;
};

export const trackRoute: Route<"get"> = {
  method: "get",
  path: "/track/" + TOP_SECRET_PATH + "/:weight",
  handler: (req) => {
    const weight = parseInt(req.params.weight);
    const timestamp = Date.now();

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
      const response = `New log entry (${formatGrams(
        weight,
      )}) created with the following id: ${result.insertedId}`;
      console.log(response);

      return response;
    });
  },
};
