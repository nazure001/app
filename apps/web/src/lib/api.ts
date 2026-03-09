const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getBuilds() {
  const res = await fetch(`${apiUrl}/api/builds`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch builds");
  }

  return res.json();
}

export async function createBuild(data: {
  title: string;
  style: string;
  biome: string;
}) {
  const res = await fetch(`${apiUrl}/api/builds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "Failed to create build"
    }));
    throw new Error(error.message || "Failed to create build");
  }

  return res.json();
}