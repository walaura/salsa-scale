import crypto from "crypto";

const REGISTERED_STYLES = new Map<string, EitherStyles<any>>();
const REGISTERED_STYLE_PROPS = new Map<string, { [key: string]: string }>();

type EitherStyles<Props> = Styles | StylesWithProps<Props>;
type Nullable<T> = { [K in keyof T]?: T[K] | null };
type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

type JsStyles = Merge<
  Nullable<CSSStyleDeclaration>,
  {
    [key: string]: JsStyles | string | number | undefined | null;
  }
>;

type StylesWithProps<Props = { [key: string]: string }> = (
  root: Selector,
  props: Props
) => string | JsStyles;
type Styles = (root: Selector) => string | JsStyles;

type Selector = {
  (child: string): string;
  toString(): string;
  keyframes(child: string): string;
};

const camelCaseToKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

const styleProps = <P>(props: P) => {
  if (!props) return "";
  return Object.entries(props)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
};

// https://www.npmjs.com/package/noop-tag
export const css = (
  strings: TemplateStringsArray,
  ...expressions: unknown[]
) => {
  let result = strings[0];
  for (let i = 1, l = strings.length; i < l; i++) {
    result += expressions[i - 1];
    result += strings[i];
  }
  return result;
};

const hash = (string: string) =>
  crypto.createHash("sha256").update(string, "utf8").digest("hex");

function withStyles<Props = null>(styles: Styles): [Selector];
function withStyles<Props = { [key: string]: string }>(
  styles: StylesWithProps<Props>,
  props: Props
): [Selector, (props: Nullable<Props>) => string];

function withStyles<Props = undefined | { [key: string]: string }>(
  styles: EitherStyles<Props>,
  props?: Props
): [Selector] | [Selector, (props: Nullable<Props>) => string] {
  const styleHash =
    props != undefined
      ? `${hash(styles(VOID_SELECTOR, props).toString())}`
      : `${hash(styles(VOID_SELECTOR, undefined as Props).toString())}`;

  const className = `style-${styleHash}`;
  if (!REGISTERED_STYLES.has(className)) {
    REGISTERED_STYLES.set(className, styles);
    if (props) {
      REGISTERED_STYLE_PROPS.set(className, props);
    }
  }

  return [makeSelector(className), styleProps];
}

const makeSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = ""
): Selector => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.keyframes = (child: string) => `kf-${rawClassName}-${child}`;

  return fn;
};

const getRegisteredStyles = () => {
  return Array.from(REGISTERED_STYLES.entries()).map(([className, styles]) => {
    let props: { [key: string]: string } = {};
    let defaultProps: string = "";

    Object.entries(REGISTERED_STYLE_PROPS.get(className) || []).forEach(
      ([key, value]) => {
        props[key] = `var(--${key})`;
        defaultProps += `--${key}: ${value};`;
      }
    );
    if (defaultProps) {
      defaultProps = css`
        .${className} {
          ${defaultProps}
        }
      `;
    }

    const selector = makeSelector(className, ".");
    const renderedStyles = styles(selector, props);

    let outputStyles = "";
    if (typeof renderedStyles === "string") {
      outputStyles = renderedStyles;
    } else {
      outputStyles = reduceJsStyles({
        [selector.toString()]: renderedStyles,
      });
      console.log(outputStyles);
    }

    return defaultProps + outputStyles;
  });
};

const reduceJsStyles = (styles: JsStyles): string => {
  let result = "";
  for (const [key, value] of Object.entries(styles)) {
    if (!(typeof value === "object")) {
      result += `${camelCaseToKebabCase(key)} : ${value};\n`;
    } else if (value !== null) {
      result += `${key} { ${reduceJsStyles(value)} }\n`;
    }
  }
  return result;
};

const VOID_SELECTOR = makeSelector("");

export { withStyles, getRegisteredStyles };
