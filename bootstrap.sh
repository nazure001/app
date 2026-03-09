#!/usr/bin/env bash
set -e

git checkout -b setup/bootstrap || git checkout setup/bootstrap

mkdir -p apps/web services/api/src packages/utils docs .github/workflows

cat > package.json <<'JSON'
{
  "name": "app",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.5.0"
  }
}
JSON

cat > pnpm-workspace.yaml <<'YAML'
packages:
  - apps/*
  - services/*
  - packages/*
YAML

cat > turbo.json <<'JSON'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {},
    "test": {}
  }
}
JSON

cat > .gitignore <<'EOF2'
node_modules
dist
.next
.env
.env.local
coverage
EOF2

cat > README.md <<'EOF2'
# App Monorepo

Initial bootstrap structure.
EOF2

cat > services/api/package.json <<'JSON'
{
  "name": "@app/api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
JSON

cat > services/api/src/index.js <<'EOF2'
import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "api" });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
EOF2

cat > packages/utils/package.json <<'JSON'
{
  "name": "@app/utils",
  "version": "1.0.0",
  "private": true,
  "type": "module"
}
JSON

cat > packages/utils/index.js <<'EOF2'
export const appName = "app";
EOF2

git add .
git commit -m "chore: bootstrap clean monorepo foundation"
