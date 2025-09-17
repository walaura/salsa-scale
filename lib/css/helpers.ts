import { createHash } from "crypto";
import { StyleHtmlProps, StyleObject, StyleProp } from "./lib/decls.ts";
import { isStyleSelector } from "./lib/htmlProps.ts";

const hash = (string: StyleObject) =>
  createHash("sha256").update(JSON.stringify(string), "utf8").digest("hex");

const withUnits =
  (units: string) =>
  (...props: (number | string)[]) =>
    props.map((p) => (typeof p === "string" ? p : `${p}${units}`)).join(" ");

const joinStyles = (...styles: StyleProp[]): StyleHtmlProps => {
  let finalClassName = [];
  let style = [];

  for (let m of styles) {
    if (Array.isArray(m)) {
      m = joinStyles(...m);
    }
    if (isStyleSelector(m)) {
      finalClassName.push(m.toString());
      continue;
    }
    finalClassName.push(m.class.toString());
    style.push(m.style);
  }

  return {
    class: finalClassName.join(" "),
    style: style.reduce((a, b) => ({ ...a, ...b }), {}),
  };
};

export { reduceStyleObject } from "./lib/jsToCss.ts";
export { hash, withUnits, joinStyles };
