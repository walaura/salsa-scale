import { ROUTES } from "@/router.ts";
import {
  BUILD_CACHE_DIR,
  getUnbundledRegisteredStyles,
} from "local-css/helpers";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

ROUTES;

mkdir(BUILD_CACHE_DIR, { recursive: true });
await Promise.all(
  Array.from(getUnbundledRegisteredStyles()).map(([key, value]) =>
    writeFile(path.join(BUILD_CACHE_DIR, `${key}.css`), value + "\n")
  )
);
console.log(
  `Wrote ${getUnbundledRegisteredStyles().size} styles to ${BUILD_CACHE_DIR}`
);
