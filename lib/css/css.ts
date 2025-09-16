import { isSelector, makeSelector } from "./lib/selector.ts";
import { maybeRegister } from "./lib/storage.ts";
import {
  DynamicInputStyles,
  type InputStyles,
  type StyleObject,
  DynamicStyleHtmlPropsUnfurler,
  type StyleProp,
  StyleHtmlProps,
  StyleHtmlClassProp,
} from "./lib/decls.ts";
import {
  camelCaseToKebabCase,
  reduceStyleObject,
  withUnits,
  hash,
} from "./helpers.ts";

const VOID_SELECTOR = makeSelector("");

const PROPS = new Proxy(
  {},
  {
    get(_, prop) {
      return `var(--${camelCaseToKebabCase(prop.toString())})`;
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

const withStyles = async (styles: InputStyles): Promise<StyleHtmlClassProp> => {
  const className = await maybeRegister(
    "styles",
    hash(styles(VOID_SELECTOR)),
    (className) => {
      const selector = makeSelector(className, ".");
      return reduceStyleObject({
        [selector.toString()]: styles(selector),
      });
    }
  );

  return makeSelector(className);
};

export const withDynamicStyles = async <Props extends {}>(
  styles: DynamicInputStyles<Props>
): Promise<DynamicStyleHtmlPropsUnfurler<Props>> => {
  const selector = await withStyles(styles(PROPS as any));

  const fn: DynamicStyleHtmlPropsUnfurler<Props> = (props) => {
    return {
      class: selector.toString(),
      style: styleProps(props),
    };
  };
  fn.selector = selector;
  return fn;
};

export const joinStyles = (...styles: StyleProp[]): StyleHtmlProps => {
  let finalClassName = [];
  let style = [];

  for (let m of styles) {
    if (Array.isArray(m)) {
      m = joinStyles(...m);
    }
    if (isSelector(m)) {
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

const withKeyframes = (styles: StyleObject) => {
  const className = maybeRegister("keyframes", hash(styles), (className) => {
    const selector = makeSelector(className, "");
    const renderedInputStyles = reduceStyleObject(styles);
    return `@keyframes ${selector.toString()} { ${renderedInputStyles} }`;
  });
  return className;
};

const rem = withUnits("rem");
const px = withUnits("px");

export type { StyleProp };
export { withStyles, withKeyframes, rem, px };
