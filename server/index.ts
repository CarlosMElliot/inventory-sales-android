import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { makeApp } from "./app";
import { configuredStore } from "./store";
if (existsSync(".env")) process.loadEnvFile(".env");
const store = configuredStore();
const app = makeApp(store, process.env.APP_ORIGIN || "http://localhost:5173");
if (existsSync("dist/index.html")) {
  app.use(express.static("dist"));
  app.get("/{*path}", (_q, r) => r.sendFile(resolve("dist/index.html")));
}
app.listen(Number(process.env.PORT || 3001), "127.0.0.1", () =>
  console.log(
    `Server on localhost:${process.env.PORT || 3001}. Authentication ${store ? "configured" : "not configured"}.`,
  ),
);
