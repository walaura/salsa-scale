export const jsxs = (name, props) => {
  const { children = "" } = props;
  delete props.children;
  return /* HTML */ `<${name} ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")}>${children}</${name}>`;
};

export const jsx = (...props) => {
  return jsxs(...props);
};

namespace JSX {
  // Allow any HTML tag
  export type IntrinsicElements = Record<string, any>;
}

// Export the main namespace
export { JSX };
