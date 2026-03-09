const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getPing() {
  try {
    const res = await fetch(`${apiUrl}/api/ping`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch {
    return { message: "api not connected" };
  }
}

export default async function Home() {
  const data = await getPing();

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>App Monorepo Ready</h1>
      <p>Frontend Next.js aktif.</p>
      <p>API response: {data.message}</p>
    </main>
  );
}
