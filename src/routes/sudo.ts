import { ObjectId } from "mongodb";
import { type LogEntry, withDb } from "../app/setup/db.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { Route, withLog, withSignInRequirement } from "@/app/setup/routes.ts";

const deleteById = ({ id }: { id: string }) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    await logs.deleteOne({ _id: new ObjectId(id) });
    const response = `Log entry deleted with the following id: ${id}`;
    return response;
  });

const markFeedingEvent = ({
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
      { $set: { feedingEventOfSize } },
    );
    const response = `Log entry marked with the following id: ${id} and size: ${feedingEventOfSize}`;
    return response;
  });

const unmarkFeedingEvent = ({ id }: { id: string }) =>
  withDb(async (database) => {
    const logs = database.collection<LogEntry>("logs");
    await logs.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { feedingEventOfSize: "" } },
    );
    const response = `Log entry unmarked with the following id: ${id}`;
    return response;
  });

export const sudoDeletRoute: Route<"get"> = {
  method: "get",
  path: "/sudo/delet/:id",
  handler: withSignInRequirement(
    withLog((req) => {
      const id = req.params.id;
      return deleteById({ id });
    }),
  ),
};

export const sudoMarkEventRoute: Route<"get"> = {
  method: "get",
  path: "/sudo/mark/:id/:size",
  handler: withSignInRequirement(
    withLog((req) => {
      const id = req.params.id;
      const feedingEventOfSize = parseInt(req.params.size);

      return markFeedingEvent({ id, feedingEventOfSize });
    }),
  ),
};

export const sudoUnMarkEventRoute: Route<"get"> = {
  method: "get",
  path: "/sudo/unmark/:id",
  handler: withSignInRequirement(
    withLog((req) => {
      const id = req.params.id;

      return unmarkFeedingEvent({ id });
    }),
  ),
};
