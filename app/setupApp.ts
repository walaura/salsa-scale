import express from "express";
import { makePage } from "../ui/shell/Page.ts";

declare global {
  namespace Express {
    interface Response {
      page: (html: string | void) => void;
      maybeCatch: <T>(fn: Promise<T>, callback: (result: T) => void) => void;
    }
  }
}

const setupApp = (): [express.Express, () => void] => {
  const app = express();
  const port = 3000;

  process.env.TZ = "Europe/London"; // update if salsa moves out

  app.use("/static", express.static("static"));
  app.use((req, res, next) => {
    const forceMode =
      req.query.dark != null
        ? "dark"
        : req.query.light != null
        ? "light"
        : undefined;

    res.page = (html: string | void) =>
      res.send(makePage({ forceMode, children: html ?? "" }));

    next();
  });

  app.use((_, res, next) => {
    res.maybeCatch = async (promise, callback) => {
      try {
        callback(await promise);
      } catch (err) {
        console.error(err);
        res.send(`Ah shit`);
      }
    };
    next();
  });

  return [
    app,
    () => {
      app.listen(port, () => {
        console.log(`Scale listening on port ${port}`);
      });
    },
  ];
};

export { setupApp };
