import { dynamicStyleStyleProp, makeStyleSelector } from "./lib/htmlProps.ts";
import { maybeRegister } from "./storage.ts";
import {
  DynamicInputStyles,
  type InputStyles,
  type StyleObject,
  DynamicStyleHtmlPropsUnfurler,
  StyleSelector,
} from "./lib/decls.ts";
import { reduceStyleObject, withUnits } from "./helpers.ts";
import { EMPTY_PROPS } from "./lib/jsToCss.ts";

export const withStyles = (styles: InputStyles): StyleSelector => {
  const className = maybeRegister((className) => {
    const selector = makeStyleSelector(className, ".");
    return reduceStyleObject({
      [selector.toString()]: styles(selector),
    });
  });

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
  const className = maybeRegister((className) => {
    const renderedInputStyles = reduceStyleObject(styles);
    return `@keyframes ${className} { ${renderedInputStyles} }`;
  });
  return className;
};

export const rem = withUnits("rem");
export const px = withUnits("px");

export type { StyleProp } from "./lib/decls.ts";
