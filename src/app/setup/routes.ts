import type { Request, Response } from "express";
import { Page } from "../../ui/Page/Page.tsx";

export type RouteHandler<ExpectedResponse> = (
  req: Request,
  res: Response,
) => Promise<ExpectedResponse>;

export type Route<Method, ExpectedResponse = string> = {
  method: Method;
  path: string;
  handler: RouteHandler<ExpectedResponse>;
};

export type PathTransformer = (path: string, req: Request) => string;
export type RouteTransformer<
  TransformedResponse,
  ExpectedResponse = unknown,
> = (
  handler: RouteHandler<ExpectedResponse>,
) => RouteHandler<TransformedResponse>;

export const withPage: RouteTransformer<string> = (handler) => {
  return (req, res) => {
    const forceMode =
      req.query.dark != null
        ? "dark"
        : req.query.light != null
          ? "light"
          : undefined;

    return handler(req, res).then((resp) => {
      return Page({
        forceMode,
        children: resp as string,
        currentRoute: req.route,
        shouldSeeSecrets: req.isSignedIn,
      });
    });
  };
};

export const withLog: RouteTransformer<string> = (handler) => {
  return (req, res) => {
    return handler(req, res).then((resp) => {
      console.log(resp);
      return resp as string;
    });
  };
};

export const withSignInRequirement: RouteTransformer<string> = (handler) => {
  return (req, res) => {
    if (!req.isSignedIn) {
      res.status(401).send("Unauthorized");
      return Promise.resolve("");
    }
    return handler(req, res).then((resp) => {
      return resp as string;
    });
  };
};
