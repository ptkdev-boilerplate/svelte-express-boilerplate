/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Express Init
 * =====================
 * Run express server
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import * as express from "express";
require("svelte/compiler");
require("svelte/register");
const Home = require("../app/pages/home/home.svelte").default;
const app = express.default();
const port = 5000;

app.use("/bundle.js", express.static(`${__dirname}/../dist/`, { index: "bundle.js" }));
app.use("/bundle.css", express.static(`${__dirname}/../dist/`, { index: "bundle.css" }));

app.get("/", (req, res) => {
	const { html, head } = Home.render({ params: req.params });
	res.send(`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />

				${head}

				<link rel="icon" type="image/png" href="/favicon.png" />
				<link rel="stylesheet" href="/bundle.css" />

				<script defer src="/bundle.js"></script>
			</head>

			<body id="app">a${html}</body>
		</html>
	`);
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});

process.on("SIGTERM", () => {
	process.exit(0);
});
process.on("SIGINT", () => {
	process.exit(0);
});
