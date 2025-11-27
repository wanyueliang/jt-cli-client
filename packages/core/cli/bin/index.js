#! /usr/bin/env node
import { fileURLToPath } from "url";
import importLocal from "import-local";
import core from "../lib/index.js";

const __filename = fileURLToPath(import.meta.url);
if (importLocal(__filename)) {
  console.log("正在使用 jt-cli 本地版本");
} else {
  core(process.argv.slice(2));
}
