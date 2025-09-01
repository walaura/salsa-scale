import { MongoClient, ObjectId } from "mongodb";
import { DELETE_PATH, TRACK_PATH } from "./app/routes.ts";
import { trackRoute } from "./routes/track.ts";
import { landingRoute } from "./routes/landing.ts";
import { setupApp } from "./app/setupApp.ts";

import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URL as string;

process.env.TZ = "Europe/London"; // update if salsa moves out

const [app, start] = setupApp();

app.get("/", async (req, res, next) => {
  const showActions = req.query.edit === process.env.TOP_SECRET_PATH;
  const chartScale = req.query.scale
    ? parseFloat(req.query.scale.toString())
    : 1;
  const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);

  res.maybeCatch(landingRoute({ showActions, chartScale, url }), res.page);
});

app.get(TRACK_PATH, (req, res) => {
  const weight = parseInt(req.params.weight);
  const timestamp = Date.now();

  res.maybeCatch(
    trackRoute({
      weight,
      timestamp,
    }),
    (resp) => res.send(resp)
  );
});

app.get(DELETE_PATH, (req, res) => {
  const id = req.params.id;

  async function run() {
    const client = new MongoClient(uri);
    try {
      const database = client.db("default");
      const logs = database.collection("logs");
      await logs.deleteOne({ _id: new ObjectId(id) });
      const response = `Log entry deleted with the following id: ${id}`;
      console.log(response);
      return response;
    } finally {
      await client.close();
    }
  }

  res.maybeCatch(run(), (resp) => res.send(resp));
});

start();
