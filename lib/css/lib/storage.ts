import { ResolvedStyleObject, StyleFn } from "./decls.ts";
import { makeSelector } from "./selector.ts";
import { createHash } from "crypto";
import { reduceStyleObject } from "local-css/helpers";
import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

type Registers = "styles" | "keyframes";
type RegistryKey = `${Registers}-${string}`;
const REGISTRY = new Map<RegistryKey, string>();

const VOID_SELECTOR = makeSelector("");
const BUILD_CACHE_DIR = path.join(cwd(), "/.build-cache");

const getRegisteredStyles = () => {
  return [...Array.from(REGISTRY.values())];
};

const maybeRegister = async (
  type: Registers,
  key: string,
  getValue: (registryKey: RegistryKey) => string
) => {
  const registryKey = `${type}-${key}` as RegistryKey;
  if (REGISTRY.has(registryKey)) {
    return registryKey;
  }

  const value = getValue(registryKey);
  REGISTRY.set(registryKey, value);
  await fs.writeFile(
    path.join(BUILD_CACHE_DIR, `${registryKey}.css`),
    value + "\n"
  );
  return registryKey;
};

const maybeRegisterStyle = async (style: StyleFn) => {
  return maybeRegister("styles", hash(style(VOID_SELECTOR)), (className) => {
    const selector = makeSelector(className, ".");
    return reduceStyleObject({
      [selector.toString()]: style(selector),
    });
  });
};

const maybeRegisterKeyframes = async (style: ResolvedStyleObject) => {
  return maybeRegister("keyframes", hash(style), (className) => {
    const selector = makeSelector(className, "");
    const renderedStyleFn = reduceStyleObject(style);
    return `@keyframes ${selector.toString()} { ${renderedStyleFn} }`;
  });
};

const hash = (string: ResolvedStyleObject) =>
  createHash("sha256").update(JSON.stringify(string), "utf8").digest("hex");

export { getRegisteredStyles, maybeRegisterStyle, maybeRegisterKeyframes };
