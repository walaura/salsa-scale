require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const { makeChart } = require("./ui/Chart");
const { makeTable } = require("./ui/Table");
const { makeDetails } = require("./ui/Details");
const { DELETE_PATH, TRACK_PATH } = require("./app/routes.js");

const app = express();
const port = 3000;
const uri = process.env.MONGO_URL;

process.env.TZ = "Europe/London"; // update if salsa moves out

app.use("/static", express.static("static"));

app.get("/", async (req, res) => {
  const showActions = req.query.edit === process.env.TOP_SECRET_PATH;
  async function run() {
    const client = new MongoClient(uri);
    try {
      const database = client.db("default");
      const logs = database.collection("logs");
      const list = logs.find().sort({ timestamp: -1 }).limit(500);

      const points = [];
      for await (const doc of list) {
        points.push(doc);
      }

      const days = {};
      for (const point of points) {
        const date = new Date(point.timestamp).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        if (!days[date]) {
          days[date] = [];
        }
        days[date].push(point);
      }

      svgLine = makeDetails({
        title: "Chart",
        children: makeChart({ points }),
        isOpen: true,
      });

      const dom = /* HTML */ `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Is salsa starving</title>
            <link rel="stylesheet" href="/static/styles.css" />
          </head>
          <body>
            ${svgLine}
            ${Object.entries(days)
              .map(([date, points], idx) =>
                makeDetails({
                  title: date,
                  children: makeTable({ points, showActions }),
                  isOpen: idx === 0,
                })
              )
              .join("")}
          </body>
        </html>`;

      res.send(dom);
    } finally {
      await client.close();
    }
  }
  run().catch((err) => {
    console.error(err);
    res.send(`Ah shit`);
  });
});

app.get(TRACK_PATH, (req, res) => {
  const weight = parseInt(req.params.weight);
  const timestamp = Date.now();

  async function run() {
    const client = new MongoClient(uri);
    try {
      const database = client.db("default");
      const logs = database.collection("logs");

      const twoPrior = [];
      for await (const doc of logs.find().sort({ timestamp: -1 }).limit(2)) {
        twoPrior.push(doc);
      }

      let isFeedingEvent = false;
      if (twoPrior[0].isFeedingEvent === true) {
        isFeedingEvent = false;
      } else {
        isFeedingEvent = twoPrior[1].weight - weight >= 5;
      }

      let timeSinceLastFeedingEvent = 0;
      if (isFeedingEvent === false) {
        const lastFeedingEvent = await logs
          .find({ isFeedingEvent: true })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();

        console.log(lastFeedingEvent[0]);
        if (lastFeedingEvent[0]) {
          timeSinceLastFeedingEvent =
            Date.now() - lastFeedingEvent[0].timestamp;
        }
      }

      if (timeSinceLastFeedingEvent > 0) {
        console.log(
          `Time since last feeding event: ${Math.round(
            timeSinceLastFeedingEvent / (1000 * 60)
          )} minutes`
        );
        // TODO email if severe
      }

      const result = await logs.insertOne({
        weight: parseInt(weight),
        timestamp,
        isFeedingEvent,
      });
      const response = `New log entry created with the following id: ${result.insertedId}`;
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
