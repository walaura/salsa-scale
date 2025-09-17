import { dynamicStyleStyleProp, makeStyleSelector } from "./lib/htmlProps.ts";
import { maybeRegister } from "./storage.ts";
import {
  DynamicInputStyles,
  type InputStyles,
  type StyleObject,
  DynamicStyleHtmlPropsUnfurler,
  type StyleProp,
  StyleSelector,
} from "./lib/decls.ts";
import { reduceStyleObject, withUnits, hash } from "./helpers.ts";
import { EMPTY_PROPS } from "./lib/jsToCss.ts";

const VOID_SELECTOR = makeStyleSelector("");

export const withStyles = (styles: InputStyles): StyleSelector => {
  const className = maybeRegister(
    "styles",
    hash(styles(VOID_SELECTOR)),
    (className) => {
      const selector = makeStyleSelector(className, ".");
      return reduceStyleObject({
        [selector.toString()]: styles(selector),
      });
    },
  );

  return makeStyleSelector(className);
};

export const withDynamicStyles = <Props extends {}>(
  styles: DynamicInputStyles<Props>,
): DynamicStyleHtmlPropsUnfurler<Props> => {
  const selector = withStyles(styles(EMPTY_PROPS as any));

  const fn: DynamicStyleHtmlPropsUnfurler<Props> = (props) => {
    return {
      class: selector.toString(),
      style: dynamicStyleStyleProp(props),
    };
  };
  fn.selector = selector;
  return fn;
};

export const withKeyframes = (styles: StyleObject) => {
  const className = maybeRegister("keyframes", hash(styles), (className) => {
    const renderedInputStyles = reduceStyleObject(styles);
    return `@keyframes ${className} { ${renderedInputStyles} }`;
  });
  return className;
};

export const rem = withUnits("rem");
export const px = withUnits("px");

export type { StyleProp } from "./lib/decls.ts";
