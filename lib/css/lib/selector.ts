import { StyleHtmlClassProp } from "./decls.ts";

export const isSelector = (obj: any): obj is StyleHtmlClassProp => {
  return typeof obj === "function" && obj.__isSelector === true;
};

const makeSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = ""
): StyleHtmlClassProp => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.__isSelector = true;
  return fn as string & typeof fn;
};

export { makeSelector };
