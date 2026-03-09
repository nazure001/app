import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "api" });
});

app.get("/api/ping", (_, res) => {
  res.json({ message: "pong" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
