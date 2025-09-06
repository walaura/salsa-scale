import { StyleFn, type StyleObject } from "./decls.ts";
import { makeSelector } from "./selector.ts";
import { createHash } from "crypto";
import { reduceStyleObject } from "local-css/helpers";

const REGISTERED_STYLES = new Map<string, StyleFn>();
const REGISTERED_KEYFRAMES = new Map<string, StyleObject>();

const VOID_SELECTOR = makeSelector("");

const getRegisteredStyles = () => {
  const styles = Array.from(REGISTERED_STYLES.entries()).map(
    ([className, styles]) => {
      const selector = makeSelector(className, ".");
      return reduceStyleObject({
        [selector.toString()]: styles(selector),
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

const maybeRegisterStyle = (style: StyleFn) => {
  const styleHash = `${hash(style(VOID_SELECTOR))}`;
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

const hash = (string: StyleObject) =>
  createHash("sha256").update(JSON.stringify(string), "utf8").digest("hex");

export { getRegisteredStyles, maybeRegisterStyle, maybeRegisterKeyframes };
