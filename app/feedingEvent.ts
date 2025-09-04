import { type LogEntry } from "./setup/db.ts";

const THRESHOLD = 3;

export const isFeedingEvent = (
  current: number,
  [prev, prevToLast]: [LogEntry, LogEntry]
): [isFeedingEvent: boolean, delta: number] => {
  const maxPreviousWeight = Math.max(prev.weight, prevToLast.weight);

  if (current >= maxPreviousWeight) {
    return [false, 0];
  }

  const delta = Math.abs(
    Math.min(current, maxPreviousWeight) - Math.max(current, maxPreviousWeight)
  );

  return [maxPreviousWeight - current > THRESHOLD, delta];
};
