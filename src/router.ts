import { TOP_SECRET_PATH } from "./app/setup/env.ts";
import { landingRoute } from "./routes/landing.tsx";
import { trackRoute } from "./routes/track.ts";
import { withLog, withPage, type Route } from "./app/setup/routes.ts";
import {
  deleteById,
  markFeedingEvent,
  unmarkFeedingEvent,
} from "./routes/sudo.ts";
import { recordsRoute } from "./routes/records/records.tsx";
import { backtestFeedingEventRoute } from "./routes/internal/backtestFeedingEventRoute.tsx";
import { uiRoute } from "./routes/internal/uiRoute.tsx";

const landing: Route<"get"> = {
  method: "get",
  path: "/",
  handler: withPage((req) => {
    const showActions = req.query.edit === TOP_SECRET_PATH;
    const chartScale = req.query.scale
      ? parseFloat(req.query.scale.toString())
      : 1;
    const url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    return landingRoute({ showActions, chartScale, url });
  }),
};

const records: Route<"get"> = {
  method: "get",
  path: "/records",
  handler: withPage((req) => {
    const showActions = req.query.edit === TOP_SECRET_PATH;
    return recordsRoute({ showActions });
  }),
};

const track: Route<"get"> = {
  method: "get",
  path: "/track/" + TOP_SECRET_PATH + "/:weight",
  handler: (req) => {
    const weight = parseInt(req.params.weight);
    const timestamp = Date.now();

    return trackRoute({
      weight,
      timestamp,
    });
  },
};

const delet: Route<"get"> = {
  method: "get",
  path: "/sudo/delet/" + TOP_SECRET_PATH + "/:id",
  handler: withLog((req) => {
    const id = req.params.id;
    return deleteById({ id });
  }),
};

const markEvent: Route<"get"> = {
  method: "get",
  path: "/sudo/mark/" + TOP_SECRET_PATH + "/:id/:size",
  handler: withLog((req) => {
    const id = req.params.id;
    const feedingEventOfSize = parseInt(req.params.size);

    return markFeedingEvent({ id, feedingEventOfSize });
  }),
};

const unMarkEvent: Route<"get"> = {
  method: "get",
  path: "/sudo/unmark/" + TOP_SECRET_PATH + "/:id",
  handler: withLog((req) => {
    const id = req.params.id;

    return unmarkFeedingEvent({ id });
  }),
};

export const ROUTES = {
  landing,
  track,
  delet,
  records,
  markEvent,
  unMarkEvent,
  backtestFeedingEventRoute,
  uiRoute,
};
