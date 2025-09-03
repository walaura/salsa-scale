import crypto from "crypto";

const REGISTERED_STYLES = new Map<string, EitherStyles<any>>();
const REGISTERED_STYLE_PROPS = new Map<string, { [key: string]: string }>();

type EitherStyles<Props> = Styles | StylesWithProps<Props>;
type Nullable<T> = { [K in keyof T]?: T[K] | null };

type StylesWithProps<Props = { [key: string]: string }> = (
  root: string,
  props: Props
) => {};
type Styles = (root: string) => string;

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

function withStyles<Props = null>(styles: Styles): [string];
function withStyles<Props = { [key: string]: string }>(
  styles: StylesWithProps<Props>,
  props: Props
): [string, (props: Nullable<Props>) => string];

function withStyles<Props = undefined | { [key: string]: string }>(
  styles: EitherStyles<Props>,
  props?: Props
): [string] | [string, (props: Nullable<Props>) => string] {
  const styleHash =
    props != undefined
      ? `${hash(styles("", props).toString())}`
      : `${hash(styles("", undefined as Props).toString())}`;

  const className = `style-${styleHash}`;
  if (!REGISTERED_STYLES.has(className)) {
    REGISTERED_STYLES.set(className, styles);
    if (props) {
      REGISTERED_STYLE_PROPS.set(className, props);
    }
  }

  return [className, styleProps];
}

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
    return defaultProps + styles("." + className, props);
  });
};

export { withStyles, getRegisteredStyles };
