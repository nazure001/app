const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getBuilds() {
  if (!apiUrl) return [];

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
  if (!apiUrl) {
    throw new Error("API URL belum dikonfigurasi");
  }

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

export async function deleteBuild(id: number) {
  if (!apiUrl) {
    throw new Error("API URL belum dikonfigurasi");
  }

  const res = await fetch(`${apiUrl}/api/builds/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "Failed to delete build"
    }));
    throw new Error(error.message || "Failed to delete build");
  }

  return res.json();
}