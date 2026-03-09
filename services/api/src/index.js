import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "api" });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
