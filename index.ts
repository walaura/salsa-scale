import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import { DELETE_PATH, TRACK_PATH } from "./app/routes.ts";
import { trackRoute } from "./routes/track.ts";
import { indexRoute } from "./routes/index.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const uri = process.env.MONGO_URL as string;

process.env.TZ = "Europe/London"; // update if salsa moves out

app.use("/static", express.static("static"));

app.get("/", async (req, res) => {
  const showActions = req.query.edit === process.env.TOP_SECRET_PATH;
  const chartScale = req.query.scale
    ? parseFloat(req.query.scale.toString())
    : 1;
  const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);
  const forceMode =
    req.query.dark != null
      ? "dark"
      : req.query.light != null
      ? "light"
      : undefined;

  indexRoute({ showActions, chartScale, url, forceMode })
    .catch((err) => {
      console.error(err);
      res.send(`Ah shit`);
    })
    .then((response) => {
      res.send(response);
    });
});

app.get(TRACK_PATH, (req, res) => {
  const weight = parseInt(req.params.weight);
  const timestamp = Date.now();

  trackRoute({
    weight,
    timestamp,
  })
    .catch((err) => {
      console.error(err);
      res.send(`Ah shit`);
    })
    .then((response) => {
      res.send(response);
    });
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
      res.send(response);
      return;
    } finally {
      await client.close();
    }
  }
  run().catch((err) => {
    console.error(err);
    res.send(`Ah shit`);
  });
});

app.listen(port, () => {
  console.log(`Scale listening on port ${port}`);
});
