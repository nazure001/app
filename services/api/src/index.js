import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const builds = [];

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

app.get("/api/builds", (_, res) => {
  res.json(builds);
});

app.post("/api/builds", (req, res) => {
  const { title, style, biome } = req.body;

  if (!title || !style || !biome) {
    return res.status(400).json({
      message: "title, style, dan biome wajib diisi"
    });
  }

  const newBuild = {
    id: Date.now(),
    title,
    style,
    biome,
    createdAt: new Date().toISOString()
  };

  builds.unshift(newBuild);

  res.status(201).json(newBuild);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});