import { makeSelector, type Selector } from "./setup/styles/selector.ts";
import {
  maybeRegisterKeyframes,
  maybeRegisterStyle,
  maybeRegisterStyleWithProps,
} from "./setup/styles/storage.ts";
import {
  type StyleFn,
  type StyleFnWithProps,
  type StyleObject,
} from "./setup/styles/decls.ts";

type Nullable<T> = { [K in keyof T]?: T[K] | null };

const styleProps = <P>(props: P) => {
  if (!props) return "";
  return Object.entries(props)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
};

function withStyles<Props = null>(styles: StyleFn): [Selector];
function withStyles<Props = { [key: string]: string }>(
  styles: StyleFnWithProps<Props>,
  props: Props
): [Selector, (props: Nullable<Props>) => string];
function withStyles<Props = undefined | { [key: string]: string }>(
  styles: StyleFn | StyleFnWithProps<Props>,
  props?: Props
): [Selector] | [Selector, (props: Nullable<Props>) => string] {
  const className =
    props != null
      ? maybeRegisterStyleWithProps(styles, props)
      : maybeRegisterStyle(styles);

  return [makeSelector(className), styleProps];
}

function withKeyframes(styles: StyleObject) {
  const className = maybeRegisterKeyframes(styles);
  return className;
}

export { withStyles, withKeyframes };
