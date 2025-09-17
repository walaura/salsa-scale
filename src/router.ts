import { TOP_SECRET_PATH } from "./app/setup/env.ts";
import { landingRoute } from "./routes/landing.tsx";
import { trackRoute } from "./routes/track.ts";
import { type Route } from "./app/setup/routes.ts";
import {
  sudoDeletRoute,
  sudoMarkEventRoute,
  sudoUnMarkEventRoute,
} from "./routes/sudo.ts";
import { recordsRoute } from "./routes/records/records.tsx";
import { backtestFeedingEventRoute } from "./routes/internal/backtestFeedingEventRoute.tsx";
import { uiRoute } from "./routes/internal/uiRoute.tsx";
import { secretRoute } from "./routes/internal/secretRoute.tsx";
import { authSignInRoute, authSignOutRoute } from "./routes/auth.ts";

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

const ROUTES = {
  landingRoute,
  authSignInRoute,
  authSignOutRoute,
  recordsRoute,
  track,
  sudoMarkEventRoute,
  sudoUnMarkEventRoute,
  sudoDeletRoute,
  backtestFeedingEventRoute,
  uiRoute,
  secretRoute,
};

export { ROUTES };
