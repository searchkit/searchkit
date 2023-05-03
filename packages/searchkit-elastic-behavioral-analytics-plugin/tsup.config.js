import { defineConfig } from "tsup";
import path from "path";

const commonConfig = {
  clean: true,
  splitting: false,
  // Skip until .d.ts.map is also supported https://github.com/egoist/tsup/issues/564
  dts: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
};
export default defineConfig([
  {
    entry: ["./src/index.ts"],
    ...commonConfig,
    // NOTE: it means CJS will be .js and ESM will be .mjs
    format: ["esm"],
    outDir: "dist",
  },
  {
    entry: ["./src/index.ts"],
    ...commonConfig,
    // NOTE: it means CJS will be .js and ESM will be .mjs
    format: ["cjs"],
    outDir: "dist",
  }
]);