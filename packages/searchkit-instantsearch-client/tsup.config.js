import { defineConfig } from "tsup";
import path from "path";

const commonConfig = {
  clean: true,
  dts: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
};
export default defineConfig([
  {
    entry: ["src/index.ts"],
    ...commonConfig,
    format: ["esm"],
    outDir: "dist",
  },
  {
    entry: ["src/index.ts"],
    ...commonConfig,
    format: ["iife"],
    minify: true,
    outDir: "dist/umd",
    globalName: "SearchkitInstantsearchClientDefault",
    footer: {
      js: "var SearchkitInstantsearchClient = SearchkitInstantsearchClientDefault.default"
    }
  },
]);