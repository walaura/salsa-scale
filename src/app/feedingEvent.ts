import { WithId } from "mongodb";
import { LogEntry } from "./setup/db.ts";

const THRESHOLD = 1.75;
const DISTANCE_THRESHOLD = 4;

const Outcome = {
  NO_DECREASE: "No decrease",
  NOISE: "Noise in data",
  SMALL_DELTA: "Delta too small",
  YAY: "Yay",
};
type DebugData = {
  outcome: (typeof Outcome)[keyof typeof Outcome];
  extra?: any;
};

export const isFeedingEvent = (
  current: number,
  lastHour: number[],
): [isFeedingEvent: boolean, delta: number, debugData: DebugData] => {
  const [prev] = lastHour;

  if (current >= prev) {
    return [false, 0, { outcome: Outcome.NO_DECREASE }];
  }

  const diff = lastHour
    .map((v, index) => (index === 0 ? 0 : lastHour[index - 1] - v))
    .slice(1);
  const diffAvg = diff.reduce((a, b) => a + b, 0) / diff.length;

  /* Filter noise (refill, temp change) */
  const maxDiff = Math.max(...diff.map(Math.abs));
  const avgDiff = Math.abs(diffAvg);
  if (maxDiff - avgDiff > DISTANCE_THRESHOLD) {
    return [
      false,
      0,
      {
        outcome: Outcome.NOISE,
        extra: {
          diff,
          calc: [maxDiff, avgDiff],
        },
      },
    ];
  }

  const delta = Math.abs(current - prev - diffAvg);

  const isFeedingEvent = delta > THRESHOLD;
  if (!isFeedingEvent) {
    return [
      false,
      0,
      {
        outcome: Outcome.SMALL_DELTA,
        extra: { delta, THRESHOLD },
      },
    ];
  }
  return [isFeedingEvent, delta, { outcome: Outcome.YAY }];
};

export const maybeMergePreviousFeedingEvent = (
  delta: number,
  lastHour: WithId<LogEntry>[],
): [number, WithId<LogEntry>["_id"][]] => {
  let mergeables = [];
  for (const prior of lastHour) {
    if (prior.feedingEventOfSize == null) {
      continue;
    }
    console.log(
      `Cleaning up previous feeding event ${prior._id} to merge with new event of size ${delta}`,
    );
    delta += prior.feedingEventOfSize;
    mergeables.push(prior._id);
  }
  return [delta, mergeables];
};
