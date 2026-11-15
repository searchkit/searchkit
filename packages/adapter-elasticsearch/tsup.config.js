import { defineConfig } from "tsup";
import path from "path";

const commonConfig = {
  clean: true,
  splitting: false,
  // Skip until .d.ts.map is also supported https://github.com/egoist/tsup/issues/564
  // Inline the @elastic/elasticsearch types we use into dist/index.d.ts, so the published types
  // are self-contained: the adapter only uses the client for types and does not depend on it.
  // The searchkit core sources this package imports (src/core.ts) are bundled in as well.
  dts: { resolve: [/^@elastic\/elasticsearch/] },
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
  },
]);
