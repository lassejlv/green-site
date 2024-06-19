import { $ } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import fs from "fs";
import ora from "ora";

const watchDir = "scss";
const compileDir = "css/index.css";
const staticFiles = "./";

// Server
const app = new Hono();

// Middleware
app.use(logger());

// Enable static files
app.notFound(async (c) => {
  const notFound = await Bun.file("not-found.html").text();
  return c.html(notFound);
});

app.get("*", serveStatic({ root: staticFiles }));

// Sass Compiler
await compile("root");

fs.watch(watchDir, { recursive: true }, async (event, file) => {
  if (file.endsWith(".scss") && event === "change") await compile(file);
  else console.log(`File ${file} changed but not compiled.`);
});

async function compile(file) {
  // Get the current time
  const start = Date.now();

  // Start the spinner
  const spinner = ora(`[SASS] File ${file} changed. Compiling...`).start();

  try {
    // Run the sass command
    await $`sass ${watchDir}/index.scss ${compileDir} --style=compressed --no-source-map`;

    // Stop the spinner
    spinner.succeed(`[SASS] Compiled in ${Date.now() - start}ms`);
  } catch (error) {
    spinner.fail(`[SASS] Compilation failed: ${error}`);
  }
}

// Start the server
const server = Bun.serve({ port: process.env.PORT || 3000, fetch: app.fetch });
const serverSpinner = ora("[SERVER] Starting server...").start();
serverSpinner.succeed(
  `[SERVER] Server started at http://localhost:${server.port}`
);
