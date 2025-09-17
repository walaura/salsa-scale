import { landingRoute } from "./routes/landing.tsx";
import { trackRoute } from "./routes/track.ts";
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

const ROUTES = {
  landingRoute,
  authSignInRoute,
  authSignOutRoute,
  recordsRoute,
  trackRoute,
  sudoMarkEventRoute,
  sudoUnMarkEventRoute,
  sudoDeletRoute,
  backtestFeedingEventRoute,
  uiRoute,
  secretRoute,
};

export { ROUTES };
