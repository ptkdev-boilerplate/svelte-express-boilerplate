/* eslint-disable @typescript-eslint/no-var-requires */
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import ttypescript from "ttypescript";
import tsPlugin from "rollup-plugin-typescript2";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import path from "path";

const config = require("./app/configs/config");
const tsconfig = require("./tsconfig.json");

const production = !config.debug;

function tsalias() {
	const paths = [];

	for (const value in tsconfig.compilerOptions.paths) {
		paths.push(
			{
				replacement: path.resolve(path.resolve(__dirname), tsconfig.compilerOptions.paths[value][0].replace("./", "").replace("/*", "")),
				find: value.replace("./", "").replace("/*", ""),
			}
		);
	}

	return paths;
}

export default {
	input: "app/core/init.ts",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "dist/bundle.js",
	},
	plugins: [
		json(),
		copy({
			targets: [
				{ src: "public/**/*", dest: "dist" },
				{ src: "assets/**/*", dest: "dist" }
			],
		}),
		svelte({
			preprocess: sveltePreprocess({
				sourceMap: !production,
				scss: { includePaths: ["app/**/*.scss"] },
			}),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		alias({
			entries: tsalias()
		}),
		commonjs(),
		typescript({
			sourceMap: true,
			inlineSources: !production,
		}),
		tsPlugin({
			typescript: ttypescript
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: "bundle.css" }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser({
			output: {
				comments: false,
			},
		}),
	],

	watch: {
		clearScreen: false,
	},
};
