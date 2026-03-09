import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../data/builds.json");

function readBuilds() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, "[]", "utf-8");
    }

    const raw = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBuilds(builds) {
  fs.writeFileSync(dataFilePath, JSON.stringify(builds, null, 2), "utf-8");
}

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
  const builds = readBuilds();
  res.json(builds);
});

app.get("/api/builds/:id", (req, res) => {
  const builds = readBuilds();
  const build = builds.find((item) => String(item.id) === req.params.id);

  if (!build) {
    return res.status(404).json({
      message: "Build tidak ditemukan"
    });
  }

  res.json(build);
});

app.post("/api/builds", (req, res) => {
  const { title, style, biome } = req.body;

  if (!title || !style || !biome) {
    return res.status(400).json({
      message: "title, style, dan biome wajib diisi"
    });
  }

  const builds = readBuilds();

  const newBuild = {
    id: Date.now(),
    title,
    style,
    biome,
    createdAt: new Date().toISOString()
  };

  builds.unshift(newBuild);
  writeBuilds(builds);

  res.status(201).json(newBuild);
});

app.delete("/api/builds/:id", (req, res) => {
  const builds = readBuilds();
  const nextBuilds = builds.filter((item) => String(item.id) !== req.params.id);

  if (nextBuilds.length === builds.length) {
    return res.status(404).json({
      message: "Build tidak ditemukan"
    });
  }

  writeBuilds(nextBuilds);

  res.json({
    message: "Build berhasil dihapus"
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});