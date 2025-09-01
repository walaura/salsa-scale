import { TOP_SECRET_PATH } from "./app/setup/env.ts";
import { landingRoute } from "./routes/landing.ts";
import { trackRoute } from "./routes/track.ts";
import { withDb } from "./app/db.ts";
import { ObjectId } from "mongodb";
import { withPage, type RouteFromExpress } from "./app/setup/routes.ts";

const landing: RouteFromExpress<"get"> = {
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

const track: RouteFromExpress<"get"> = {
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

const delet: RouteFromExpress<"get"> = {
  method: "get",
  path: "/delet/" + TOP_SECRET_PATH + "/:id",
  handler: (req) => {
    const id = req.params.id;

    return withDb(async (database) => {
      const logs = database.collection("logs");
      await logs.deleteOne({ _id: new ObjectId(id) });
      const response = `Log entry deleted with the following id: ${id}`;
      console.log(response);
      return response;
    });
  },
};

export const ROUTES = {
  landing,
  track,
  delet,
};
