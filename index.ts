import {} from "./app/setup/env.ts";

import { ROUTES } from "./router.ts";
import { setupExpress } from "./app/setup/express.ts";

const [express, start] = setupExpress();

for (const route of Object.values(ROUTES)) {
  express[route.method](route.path, (req, res) => {
    res.maybeCatch(route.handler(req), (resp) => res.send(resp));
  });
}
start();
