export type Selector = {
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

  return fn;
};

export { makeSelector };
