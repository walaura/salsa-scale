import type { JSX } from "react";

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
  const { children = "" } = props;
  delete props.children;

  return /* HTML */ `<${name} ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")}>${children}</${name}>`;
};

export const jsx = <T extends {}>(...props: Parameters<typeof jsxs<T>>) => {
  return jsxs(...props);
};

declare module "react" {
  interface HTMLAttributes<T> {
    class?: string;
  }
}

export { JSX };
