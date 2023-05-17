import { defineConfig } from "rollup";

import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default defineConfig({
    input: "src/index.ts",
    output: {
        dir: "dist",
        format: "esm",
    },
    external: ["discord.js"],
    plugins: [
        nodeResolve({
            exportConditions: ["node"],
        }),
        typescript(),
        commonjs(),
        json(),
    ],
});
