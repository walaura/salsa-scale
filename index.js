require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const { makeChart } = require("./ui/Chart");
const { makeTable } = require("./ui/Table");
const { makeDetails } = require("./ui/Details");

const app = express();
const port = 3000;
const uri = process.env.MONGO_URL;

process.env.TZ = "Europe/London"; // update if salsa moves out

app.use("/static", express.static("static"));

app.get("/", async (req, res) => {
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

      const table = makeDetails({
        title: "All days",
        children: makeTable({
          points,
        }),
        isOpen: true,
      });

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
                  children: makeTable({ points }),
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

app.get("/track/" + process.env.TOP_SECRET_PATH + "/:weight", (req, res) => {
  const weight = req.params.weight;
  const timestamp = Date.now();

  async function run() {
    const client = new MongoClient(uri);
    try {
      const database = client.db("default");
      const logs = database.collection("logs");
      const result = await logs.insertOne({
        weight: parseInt(weight),
        timestamp,
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
