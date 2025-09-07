export type BasicStyleSelector = string & {
  (child: string): string;
  toString(): string;
  __isSelector: true;
};

const makeSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = ""
): BasicStyleSelector => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.keyframes = (child: string) => `kf-${rawClassName}-${child}`;
  fn.__isSelector = true;
  return fn as any as BasicStyleSelector;
};

export { makeSelector };
