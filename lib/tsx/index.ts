import { reduceStyleObject } from "local-css/helpers";
import type { JSX, ReactNode } from "react";

export const jsxs = <
  T extends {
    children?: string;
  }
>(
  name: string | ((props: T) => void),
  props: T
) => {
  if (typeof name === "function") {
    return name(props);
  }
  let { children = "" } = props;
  delete props.children;

  if (Array.isArray(children)) {
    children = children.join("");
  }

  return /* HTML */ `<${name} ${Object.entries(props)
    .map(([key, value]) => {
      if (key === "style" && typeof value === "object" && value !== null) {
        value = reduceStyleObject(value);
      }
      return Boolean(value) ? `${key}="${value}"` : "";
    })
    .join(" ")}>${children}</${name}>`;
};

export const jsx = <T extends {}>(...props: Parameters<typeof jsxs<T>>) => {
  return jsxs(...props);
};

declare module "react" {
  interface HTMLAttributes<T> {
    class?: string;
  }
  interface SVGAttributes<T> {
    class?: string;
  }
}

export const Fragment = ({ children }: { children: string }) => {
  if (Array.isArray(children)) {
    children = children.join("");
  }
  return children;
};

export type JSXNode = ReactNode;

export { JSX };
