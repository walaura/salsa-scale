import {} from "./app/setup/env.ts";

import { ROUTES } from "./router.ts";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use("/static", express.static("static"));
app.use(cookieParser());

for (const route of Object.values(ROUTES)) {
  app[route.method](route.path, async (req, res) => {
    try {
      const resp = await route.handler(req, res);
      res.send(resp);
    } catch (err) {
      console.error(err);
      res.send(`Ah shit`);
    }
  });
}

app.listen(port, () => {
  console.log(`Scale listening on port ${port}`);
});
