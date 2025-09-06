import type { Request } from "express";
import { Page } from "../../ui/shell/Page.tsx";

export type RouteHandler<ExpectedResponse> = (
  req: Request
) => Promise<ExpectedResponse>;

export type RouteFromExpress<Method, ExpectedResponse = string> = {
  method: Method;
  path: string;
  handler: RouteHandler<ExpectedResponse>;
};

export const withPage = <ExpectedResponse>(
  handler: RouteHandler<ExpectedResponse>
): RouteHandler<string> => {
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

export const withLog = <ExpectedResponse>(
  handler: RouteHandler<ExpectedResponse>
): RouteHandler<string> => {
  return (req) => {
    return handler(req).then((resp) => {
      console.log(resp);
      return resp as string;
    });
  };
};
