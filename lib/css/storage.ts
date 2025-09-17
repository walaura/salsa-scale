import { PROD } from "@/app/setup/env.ts";
import fs, { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { getCallSite } from "node:util";
import prettier from "prettier";

type Registers = "styles" | "keyframes";

const SHORT_REGISTER_KEY: Record<Registers, string> = {
  styles: "s",
  keyframes: "k",
};

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

const maybeRegister = (
  type: Registers,
  key: string,
  getValue: (registryKey: string) => string,
) => {
  const registryKey = [SHORT_REGISTER_KEY[type], key].filter(Boolean).join("-");
  if (PROD || REGISTRY.has(registryKey)) {
    return registryKey;
  }

  const value = getValue(registryKey);
  REGISTRY.set(registryKey, value);
  return registryKey;
};

const writeToDisk = async () => {
  mkdir(BUILD_CACHE_DIR, { recursive: true });
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
