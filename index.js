require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");

const app = express();
const port = 3000;
const uri = process.env.MONGO_URL;

app.use("/static", express.static("static"));

app.get("/", async (req, res) => {
  async function run() {
    const client = new MongoClient(uri);
    try {
      const database = client.db("default");
      console.log({ database });
      const logs = database.collection("logs");
      const list = logs.find().sort({ timestamp: -1 }).limit(500);

      let results = ``;
      for await (const doc of list) {
        results += `
        <tr>
          <td class="weight">${doc.weight}g</td>
          <td class="timestamp">${new Date(doc.timestamp).toLocaleString()}</td>
        </tr>`;
      }

      let table = `<table class="container">
        <thead>
          <tr>
            <th>Weight</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${results}
        </tbody>
      </table>`;

      table = makeDetails({
        title: "All days",
        children: table,
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
