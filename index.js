require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");

const app = express();
const port = 3000;
const uri = process.env.MONGO_URL;

const MSECS_IN_DAY = 24 * 60 * 60 * 1000;
const CHART_LENGTH = MSECS_IN_DAY / 4;

app.use("/static", express.static("static"));

app.get("/", async (req, res) => {
  async function run() {
    const client = new MongoClient(uri);
    try {
      const timestamp = Date.now();
      const database = client.db("default");
      const logs = database.collection("logs");
      const list = logs.find().sort({ timestamp: -1 }).limit(500);

      const points = [];
      for await (const doc of list) {
        points.push(doc);
      }

      const svgPointsCount = points.filter(
        (point) => point.timestamp > timestamp - CHART_LENGTH
      ).length;

      const svgPoints = points
        .slice(0, svgPointsCount + 6)
        .map((point) => ({
          ...point,
          timeOffset:
            (CHART_LENGTH - (timestamp - point.timestamp)) / CHART_LENGTH,
        }))
        .reverse();

      console.log(svgPoints);
      const maxWeight = Math.max(...svgPoints.map((point) => point.weight));
      let svgLine = ` <svg
        height="200"
        width="100%"
        preserveAspectRatio="none"
        viewBox="0 0 1000 ${maxWeight}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="${svgPoints
            .map((point) => {
              const x = Math.floor(point.timeOffset * 1000);
              const y = maxWeight - Math.max(point.weight, 0);
              return `${x} ${y}`;
            })
            .join(", ")}"
          style="fill:none;stroke-width:5;stroke-linecap:round"
        />
      </svg>`;

      let table = `<table class="container">
        <thead>
          <tr>
            <th>Weight</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${points
            .map(
              (point) => `
            <tr>
              <td class="weight">${point.weight}g</td>
              <td class="timestamp">${new Date(
                point.timestamp
              ).toLocaleString()}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;

      table = makeDetails({
        title: "All days",
        children: table,
        isOpen: true,
      });

      svgLine = makeDetails({
        title: "Chart",
        children: svgLine,
        isOpen: true,
      });

      const dom = ` <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Is salsa starving</title>
            <link rel="stylesheet" href="/static/styles.css" />
          </head>
          <body>
            ${svgLine}
            ${table}
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

const makeDetails = ({ title, children, isOpen }) => `
  <details ${isOpen ? "open" : ""}>
    <summary>${title}</summary>
    <div class="details-content">
        ${children}
    </div>
  </details>
`;
