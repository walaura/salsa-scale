import express from "express";
import { makePage } from "../../ui/shell/Page.ts";

declare global {
  namespace Express {
    interface Response {
      maybeCatch: <T>(fn: Promise<T>, callback: (result: T) => void) => void;
    }
  }
}

const setupExpress = (): [express.Express, () => void] => {
  const app = express();
  const port = 3000;

  app.use("/static", express.static("static"));

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

export { setupExpress };
