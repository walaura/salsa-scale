export type Selector = string & {
  (child: string): string;
  toString(): string;
};

const makeSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = ""
): Selector => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.keyframes = (child: string) => `kf-${rawClassName}-${child}`;

  return fn as any as Selector;
};

export { makeSelector };
