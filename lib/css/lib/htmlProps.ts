import { StyleObject, StyleSelector } from "./decls.ts";

const isStyleSelector = (obj: any): obj is StyleSelector => {
  return typeof obj === "function" && obj.__isSelector === true;
};

const makeStyleSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = "",
): StyleSelector => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.__isSelector = true;
  return fn as string & typeof fn;
};

const dynamicStyleStyleProp = <P extends {}>(props: P): StyleObject => {
  if (!props) return {};
  const returnable = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [`--${key}`, value]),
  );
  return returnable as StyleObject;
};

export { makeStyleSelector, isStyleSelector, dynamicStyleStyleProp };
