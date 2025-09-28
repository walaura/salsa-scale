import { PROD } from "@/app/setup/env.ts";
import fs, { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import prettier from "prettier";
import { camelCaseToKebabCase } from "./lib/jsToCss.ts";

const REGISTRY = new Map<string, string>();
const BUILD_CACHE_DIR = path.join(cwd(), "/.build-cache");

const getRegisteredStyles = async () => {
  if (!PROD) {
    return ["/* USING LIVE STYLES */", ...Array.from(REGISTRY.values())];
  }
  const files = await fs.readdir(BUILD_CACHE_DIR);
  const contents = await Promise.all(
    files.map((file) => fs.readFile(path.join(BUILD_CACHE_DIR, file), "utf-8")),
  );

  return contents.filter((content) => content.trim().length > 0);
};

const maybeRegister = (getValue: (registryKey: string) => string) => {
  const registryKey = getClassName();
  if (PROD || REGISTRY.has(registryKey)) {
    return registryKey;
  }

  const value = getValue(registryKey);
  REGISTRY.set(registryKey, value);
  return registryKey;
};

const getClassName = () => {
  const err = new Error();
  const pst = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, trace) => {
    const currentScript = import.meta.dirname || path.dirname(import.meta.url);
    const cs = trace
      .filter((cs) => !cs.getFileName()?.includes(currentScript))
      .slice(0, 1)
      .pop()!;

    const base = camelCaseToKebabCase(
      path.basename(cs.getFileName()?.split(".")[0] ?? ""),
    );
    const identifier = `${cs.getColumnNumber()}X${cs.getLineNumber()}`;
    return base + "-" + identifier;
  };
  const rt = err.stack;
  Error.prepareStackTrace = pst;
  if (rt == null) {
    throw new Error("Could not get class name");
  }
  if (typeof rt !== "string") {
    throw new Error("Wtf lol");
  }
  return rt;
};

const writeToDisk = async () => {
  try {
    await rm(BUILD_CACHE_DIR, { recursive: true });
  } catch {}
  await mkdir(BUILD_CACHE_DIR, { recursive: true });
  await Promise.all(
    Array.from(REGISTRY).map(async ([key, value]) =>
      writeFile(
        path.join(BUILD_CACHE_DIR, `${key}.css`),
        (await prettier.format(value, { parser: "css" })) + "\n",
      ),
    ),
  );
  return `Wrote ${REGISTRY.size} styles to ${BUILD_CACHE_DIR}`;
};

export { getRegisteredStyles, maybeRegister, writeToDisk };
