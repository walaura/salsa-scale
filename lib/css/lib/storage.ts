import { PROD } from "@/app/setup/env.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

type Registers = "styles" | "keyframes";
type RegistryKey = `${Registers}-${string}`;

const REGISTRY = new Map<RegistryKey, string>();
export const BUILD_CACHE_DIR = path.join(cwd(), "/.build-cache");

const getRegisteredStyles = async () => {
  if (!PROD) {
    return [...Array.from(REGISTRY.values())];
  }
  const files = await fs.readdir(BUILD_CACHE_DIR);
  const contents = await Promise.all(
    files.map((file) => fs.readFile(path.join(BUILD_CACHE_DIR, file), "utf-8"))
  );

  return contents.filter((content) => content.trim().length > 0);
};

const getUnbundledRegisteredStyles = () => {
  return REGISTRY;
};

const maybeRegister = (
  type: Registers,
  key: string,
  getValue: (registryKey: RegistryKey) => string
) => {
  const registryKey = `${type}-${key}` as RegistryKey;
  if (PROD || REGISTRY.has(registryKey)) {
    return registryKey;
  }

  const value = getValue(registryKey);
  REGISTRY.set(registryKey, value);
  return registryKey;
};

export { getRegisteredStyles, getUnbundledRegisteredStyles, maybeRegister };
