import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { Route, withLog } from "@/app/setup/routes.ts";

export const authSignInRoute: Route<"post"> = {
  method: "post",
  path: "/auth/" + TOP_SECRET_PATH + "/sign-in/",
  handler: withLog(async (_, res) => {
    res.setSignInCookie();
    return await "kk";
  }),
};

export const authSignOutRoute: Route<"post"> = {
  method: "post",
  path: "/auth/" + TOP_SECRET_PATH + "/sign-out/",
  handler: withLog(async (_, res) => {
    res.setSignOutCookie();
    return await "kk";
  }),
};
