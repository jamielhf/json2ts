import clear from "rollup-plugin-clear";
import replace from "@rollup/plugin-replace";
import esbuild from "rollup-plugin-esbuild";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";

const useBabelPlugin = function (options = {}, minified) {
  return getBabelOutputPlugin({
    presets: [["@babel/preset-env", options]],
    filename: "json2ts",
    minified,
  });
};

const esbuildPlugin = esbuild({
  sourceMap: true,
  target: "es2015",
});

const esbuildMinifer = (options) => {
  const { renderChunk } = esbuild(options);

  return {
    name: "esbuild-minifer",
    renderChunk,
  };
};

module.exports = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "es",
        plugins: [useBabelPlugin()],
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        plugins: [useBabelPlugin()],
      },
      {
        file: `dist/index.umd.js`,
        name: "json2ts",
        plugins: [useBabelPlugin({ modules: "umd" })],
      },
      {
        file: `dist/index.umd.min.js`,
        name: "json2ts",
        plugins: [useBabelPlugin({ modules: "umd" }, true)],
      },
    ],
    plugins: [
      clear({
        targets: ["./dist"],
      }),
      esbuildPlugin,
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "types/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
