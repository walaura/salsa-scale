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
import { sitemapRoute } from "./routes/internal/sitemapRoute.tsx";

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

const ROUTES = {
  landingRoute,
  recordsRoute,
  track,
  delet,
  markEvent,
  unMarkEvent,
  backtestFeedingEventRoute,
  uiRoute,
  sitemapRoute,
};

export { ROUTES };
