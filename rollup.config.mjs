import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser'
import dts from "rollup-plugin-dts";
import json from '@rollup/plugin-json'
import packageJson from "./package.json" assert {type: "json"};

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
            },
            {
                file: packageJson.module,
                format: "esm",
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            json(),
            typescript({tsconfig: "./tsconfig.release.json"}),
            terser(),
        ],
    },
    {
        input: "src/index.ts",
        output: [{
            file: "dist/index.d.ts",
            format: "es"
        }],
        plugins: [dts()],
    },
];
