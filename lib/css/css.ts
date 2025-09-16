import { makeSelector, type BasicStyleSelector } from "./lib/selector.ts";
import { maybeRegisterKeyframes, maybeRegisterStyle } from "./lib/storage.ts";
import {
  DynamicStyleFn,
  type StyleFn,
  type ResolvedStyleObject,
  DynamicStyleSelector,
  type StyleSelectors,
  ResolvedDynamicStyleSelector,
} from "./lib/decls.ts";
import { camelCaseToKebabCase } from "./helpers.ts";

const PROPS = new Proxy(
  {},
  {
    get(_, prop) {
      return `var(--${camelCaseToKebabCase(prop.toString())})`;
    },
  }
);

const styleProps = <P extends {}>(props: P): ResolvedStyleObject => {
  if (!props) return {};
  const returnable = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [`--${key}`, value])
  );
  return returnable as ResolvedStyleObject;
};

const withStyles = (styles: StyleFn): BasicStyleSelector => {
  const className = maybeRegisterStyle(styles);
  return makeSelector(className);
};

export const withDynamicStyles = <Props extends {}>(
  styles: DynamicStyleFn<Props>
): DynamicStyleSelector<Props> => {
  const className = maybeRegisterStyle(styles(PROPS as any));
  const selector = makeSelector(className);
  const fn: DynamicStyleSelector<Props> = (props) => {
    return {
      class: selector.toString(),
      style: styleProps(props),
    };
  };
  fn.selector = selector;
  return fn;
};

export const joinStyles = (
  ...styles: StyleSelectors[]
): ResolvedDynamicStyleSelector => {
  let finalClassName = [];
  let style = [];

  for (let m of styles) {
    if (Array.isArray(m)) {
      m = joinStyles(...m);
    }
    if ("__isSelector" in m === true) {
      finalClassName.push(m.toString());
      continue;
    }
    finalClassName.push(m.class.toString());
    style.push(m.style);
  }

  return {
    class: finalClassName.join(" "),
    style: style.reduce((a, b) => ({ ...a, ...b }), {}),
  };
};

const withKeyframes = (styles: ResolvedStyleObject) => {
  const className = maybeRegisterKeyframes(styles);
  return className;
};

const withUnits =
  (units: string) =>
  (...props: (number | string)[]) =>
    props.map((p) => (typeof p === "string" ? p : `${p}${units}`)).join(" ");

const rem = withUnits("rem");
const px = withUnits("px");

export type { StyleSelectors };
export { withStyles, withKeyframes, rem, px };
