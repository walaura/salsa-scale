import { ObjectId } from "mongodb";
import { type LogEntry, withDb } from "../app/setup/db.ts";
import { Route, withLog, withSignInRequirement } from "@/app/setup/routes.ts";

export const sudoDeletRoute: Route<"get"> = {
  method: "get",
  path: "/sudo/delet/:id",
  handler: withSignInRequirement(
    withLog((req) => {
      const id = req.params.id;
      return withDb(async (database) => {
        const logs = database.collection<LogEntry>("logs");
        await logs.deleteOne({ _id: new ObjectId(id) });
        const response = `Log entry deleted with the following id: ${id}`;
        return response;
      });
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

      return withDb(async (database) => {
        const logs = database.collection<LogEntry>("logs");
        await logs.updateOne(
          { _id: new ObjectId(id) },
          { $set: { feedingEventOfSize } },
        );
        const response = `Log entry marked with the following id: ${id} and size: ${feedingEventOfSize}`;
        return response;
      });
    }),
  ),
};

export const sudoUnMarkEventRoute: Route<"get"> = {
  method: "get",
  path: "/sudo/unmark/:id",
  handler: withSignInRequirement(
    withLog((req) => {
      const id = req.params.id;

      return withDb(async (database) => {
        const logs = database.collection<LogEntry>("logs");
        await logs.updateOne(
          { _id: new ObjectId(id) },
          { $unset: { feedingEventOfSize: "" } },
        );
        const response = `Log entry unmarked with the following id: ${id}`;
        return response;
      });
    }),
  ),
};
