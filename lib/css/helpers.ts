import { createHash } from "crypto";
import { StyleObject } from "./lib/decls.ts";

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

const hash = (string: StyleObject) =>
  createHash("sha256").update(JSON.stringify(string), "utf8").digest("hex");

const withUnits =
  (units: string) =>
  (...props: (number | string)[]) =>
    props.map((p) => (typeof p === "string" ? p : `${p}${units}`)).join(" ");

export { camelCaseToKebabCase, reduceStyleObject, hash, withUnits };
