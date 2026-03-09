import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    ok: true,
    service: "api"
  });
});

app.get("/api/ping", (_, res) => {
  res.json({
    message: "pong"
  });
});

app.get("/api/app", (_, res) => {
  res.json({
    name: "App Monorepo",
    version: "1.0.0",
    status: "running"
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});