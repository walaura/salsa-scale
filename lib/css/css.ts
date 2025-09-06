import { makeSelector, type Selector } from "./lib/selector.ts";
import { maybeRegisterKeyframes, maybeRegisterStyle } from "./lib/storage.ts";
import { DynamicStyleFn, type StyleFn, type StyleObject } from "./lib/decls.ts";

const PROPS = new Proxy(
  {},
  {
    get(target, prop) {
      return `var(--${prop.toString()})`;
    },
  }
);

const styleProps = <P extends {}>(props: P): StyleObject => {
  if (!props) return {};
  const returnable = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [`--${key}`, value])
  );
  return returnable as StyleObject;
};

const withStyles = (styles: StyleFn): Selector => {
  const className = maybeRegisterStyle(styles);
  return makeSelector(className);
};

export const withDynamicStyles = <Props extends {}>(
  styles: DynamicStyleFn<Props>
): ((props: Props) => {
  class: Selector;
  style: StyleObject;
}) => {
  const className = maybeRegisterStyle(styles(PROPS as any));
  return (props: Props) => ({
    class: makeSelector(className),
    style: styleProps(props),
  });
};

const withKeyframes = (styles: StyleObject) => {
  const className = maybeRegisterKeyframes(styles);
  return className;
};

const withUnits =
  (units: string) =>
  (...props: (number | string)[]) =>
    props.map((p) => (typeof p === "string" ? p : `${p}${units}`)).join(" ");

const rem = withUnits("rem");
const px = withUnits("px");

export { withStyles, withKeyframes, rem, px };
