require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/track/" + process.env.TOP_SECRET_PATH + "/:weight", (req, res) => {
  const weight = req.params.weight;
  const unixDate = Date.now();
  console.log(`Weight: ${weight}, Timestamp: ${unixDate}`);
  res.send(`Weight received: ${weight}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
