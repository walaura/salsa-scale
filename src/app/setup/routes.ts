import type { Request } from "express";
import { Page } from "../../ui/shell/Page.tsx";
import { TOP_SECRET_PATH } from "./env.ts";

export type RouteHandler<ExpectedResponse> = (
  req: Request
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
  return (req) => {
    const forceMode =
      req.query.dark != null
        ? "dark"
        : req.query.light != null
        ? "light"
        : undefined;
    return handler(req).then((resp) => {
      return Page({
        forceMode,
        children: resp as string,
        currentRoute: req.route,
      });
    });
  };
};

export const withLog: RouteTransformer<string> = (handler) => {
  return (req) => {
    return handler(req).then((resp) => {
      console.log(resp);
      return resp as string;
    });
  };
};

export const getShouldSeeSecrets = (req: Request): boolean => {
  return req.query.edit === TOP_SECRET_PATH;
};
