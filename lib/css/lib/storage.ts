import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

type Registers = "styles" | "keyframes";
type RegistryKey = `${Registers}-${string}`;
const REGISTRY = new Map<RegistryKey, string>();

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
  // await fs.writeFile(
  //   path.join(BUILD_CACHE_DIR, `${registryKey}.css`),
  //   value + "\n"
  // );
  return registryKey;
};

export { getRegisteredStyles, maybeRegister };
