export const isSelector = (obj: any): obj is BasicStyleSelector => {
  return typeof obj === "function" && obj.__isSelector === true;
};

const makeSelector = (
  rawClassName: string,
  maybePrefix: "." | "" = ""
): BasicStyleSelector => {
  const className = `${maybePrefix}${rawClassName}`;
  const fn = (child: string) => [className, child].join("-");
  fn.toString = () => className;
  fn.__isSelector = true;
  return fn as any as BasicStyleSelector;
};

export { makeSelector };
