import { TOP_SECRET_PATH } from "./app/setup/env.ts";
import { landingRoute } from "./routes/landing.tsx";
import { trackRoute } from "./routes/track.ts";
import { withLog, type Route } from "./app/setup/routes.ts";
import {
  deleteById,
  markFeedingEvent,
  unmarkFeedingEvent,
} from "./routes/sudo.ts";
import { recordsRoute } from "./routes/records/records.tsx";
import { backtestFeedingEventRoute } from "./routes/internal/backtestFeedingEventRoute.tsx";
import { uiRoute } from "./routes/internal/uiRoute.tsx";
import { secretRoute } from "./routes/internal/secretRoute.tsx";

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

const loginRoute: Route<"post"> = {
  method: "post",
  path: "/sudo/" + TOP_SECRET_PATH + "/log/in/",
  handler: withLog(async (_, res) => {
    let options = {
      maxAge: Number.MAX_SAFE_INTEGER / 2,
    };

    res.cookie(TOP_SECRET_PATH, TOP_SECRET_PATH, options);
    return await "kk";
  }),
};

const logoutRoute: Route<"post"> = {
  method: "post",
  path: "/sudo/" + TOP_SECRET_PATH + "/log/out/",
  handler: withLog(async (_, res) => {
    let options = {
      maxAge: 0,
    };

    res.cookie(TOP_SECRET_PATH, "", options);
    return await "kk";
  }),
};

const ROUTES = {
  landingRoute,
  loginRoute,
  logoutRoute,
  recordsRoute,
  track,
  delet,
  markEvent,
  unMarkEvent,
  backtestFeedingEventRoute,
  uiRoute,
  secretRoute,
};

export { ROUTES };
