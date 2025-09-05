import {
  type EitherStyleFn,
  type StyleFnWithProps,
  type StyleObject,
} from "./decls.ts";
import { makeSelector } from "./selector.ts";
import { createHash } from "crypto";

const REGISTERED_STYLES = new Map<string, EitherStyleFn<any>>();
const REGISTERED_KEYFRAMES = new Map<string, StyleObject>();
const REGISTERED_STYLE_PROPS = new Map<string, { [key: string]: string }>();

const VOID_SELECTOR = makeSelector("");

const getRegisteredStyles = () => {
  const styles = Array.from(REGISTERED_STYLES.entries()).map(
    ([className, styles]) => {
      let props: { [key: string]: string } = {};
      let defaultProps: { [key: string]: string } = {};

      Object.entries(REGISTERED_STYLE_PROPS.get(className) || []).forEach(
        ([key, value]) => {
          props[key] = `var(--${key})`;
          defaultProps[`--${key}`] = value;
        }
      );

      const selector = makeSelector(className, ".");
      const renderedStyleFn = styles(selector, props);

      return reduceStyleObject({
        [selector.toString()]: { ...defaultProps, ...renderedStyleFn },
      });
    }
  );
  const keyframes = Array.from(REGISTERED_KEYFRAMES.entries()).map(
    ([className, styles]) => {
      const selector = makeSelector(className, "");
      const renderedStyleFn = reduceStyleObject(styles);
      return `@keyframes ${selector.toString()} { ${renderedStyleFn} }`;
    }
  );

  return [...styles, ...keyframes];
};

const reduceStyleObject = (styles: StyleObject): string => {
  let result = "";
  for (const [key, value] of Object.entries(styles)) {
    if (!(typeof value === "object")) {
      result += `${camelCaseToKebabCase(key)} : ${value};\n`;
    } else if (value !== null) {
      result += `${key} { ${reduceStyleObject(value)} }\n`;
    }
  }
  return result;
};

const maybeRegisterStyle = (style: EitherStyleFn<any>) => {
  const styleHash = `${hash(style(VOID_SELECTOR, {}))}`;
  const className = `st-${styleHash}`;

  if (!REGISTERED_STYLES.has(className)) {
    REGISTERED_STYLES.set(className, style);
  }
  return className;
};

const maybeRegisterKeyframes = (style: StyleObject) => {
  const styleHash = `${hash(style)}`;
  const className = `kf-${styleHash}`;

  if (!REGISTERED_KEYFRAMES.has(className)) {
    REGISTERED_KEYFRAMES.set(className, style);
  }
  return className;
};

const maybeRegisterStyleWithProps = <Props extends {}>(
  style: StyleFnWithProps<Props>,
  props: Props
) => {
  const className = maybeRegisterStyle(style);
  REGISTERED_STYLE_PROPS.set(className, props);
  return className;
};

const camelCaseToKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

const hash = (string: StyleObject) =>
  createHash("sha256").update(JSON.stringify(string), "utf8").digest("hex");

export {
  getRegisteredStyles,
  maybeRegisterStyle,
  maybeRegisterStyleWithProps,
  maybeRegisterKeyframes,
};
