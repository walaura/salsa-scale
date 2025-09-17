const EMPTY_PROPS = new Proxy(
  {},
  {
    get(_, prop) {
      return `var(--${camelCaseToKebabCase(prop.toString())})`;
    },
  },
);

const camelCaseToKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

const reduceStyleObject = (styles: { [key: string]: any }): string => {
  let result = "";
  for (const [key, value] of Object.entries(styles)) {
    if (!(typeof value === "object")) {
      result += `${camelCaseToKebabCase(key)} : ${value};\n`;
    } else if (value !== null) {
      result += `${key} { ${reduceStyleObject(value)} }\n`;
    }
  }
  return result;
};

export { camelCaseToKebabCase, reduceStyleObject, EMPTY_PROPS };
