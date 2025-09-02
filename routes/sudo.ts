import { ObjectId } from "mongodb";
import { type LogEntry, withDb } from "../app/db.ts";

export const deleteById = ({ id }: { id: string }) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    await logs.deleteOne({ _id: new ObjectId(id) });
    const response = `Log entry deleted with the following id: ${id}`;
    return response;
  });

export const markFeedingEvent = ({
  id,
  feedingEventOfSize,
}: {
  id: string;
  feedingEventOfSize: number;
}) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    await logs.updateOne(
      { _id: new ObjectId(id) },
      { $set: { feedingEventOfSize } }
    );
    const response = `Log entry marked with the following id: ${id} and size: ${feedingEventOfSize}`;
    return response;
  });

export const unmarkFeedingEvent = ({ id }: { id: string }) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    await logs.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { feedingEventOfSize: "" } }
    );
    const response = `Log entry unmarked with the following id: ${id}`;
    return response;
  });
