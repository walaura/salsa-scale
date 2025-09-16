import type { Request, Response } from "express";
import { Page } from "../../ui/Page/Page.tsx";
import { TOP_SECRET_PATH } from "./env.ts";

export type RouteHandler<ExpectedResponse> = (
  req: Request,
  res: Response
) => Promise<ExpectedResponse>;

export type Route<Method, ExpectedResponse = string> = {
  method: Method;
  path: string;
  handler: RouteHandler<ExpectedResponse>;
};

export type PathTransformer = (path: string, req: Request) => string;
export type RouteTransformer<
  TransformedResponse,
  ExpectedResponse = unknown
> = (
  handler: RouteHandler<ExpectedResponse>
) => RouteHandler<TransformedResponse>;

export const withPage: RouteTransformer<string> = (handler) => {
  return (req, res) => {
    const forceMode =
      req.query.dark != null
        ? "dark"
        : req.query.light != null
        ? "light"
        : undefined;

    const shouldSeeSecrets = req.cookies?.[TOP_SECRET_PATH] === TOP_SECRET_PATH;

    return handler(req, res).then((resp) => {
      return Page({
        forceMode,
        children: resp as string,
        currentRoute: req.route,
        shouldSeeSecrets,
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

export const getShouldSeeSecrets = (req: Request): boolean => {
  return req.query.edit === TOP_SECRET_PATH;
};
