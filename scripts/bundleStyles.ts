import { ROUTES } from "@/router.ts";
import { writeToDisk } from "local-css/storage";

ROUTES;

console.log("Writing styles to disk...");
console.log(await writeToDisk());
