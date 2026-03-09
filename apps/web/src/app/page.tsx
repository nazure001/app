const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getAppData() {
  try {
    const res = await fetch(`${apiUrl}/api/app`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch app data");
    }

    return res.json();
  } catch {
    return {
      name: "Unknown App",
      version: "-",
      status: "api not connected"
    };
  }
}

export default async function Home() {
  const data = await getAppData();

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "720px",
        margin: "0 auto"
      }}
    >
      <h1>App Monorepo</h1>
      <p>Frontend Next.js sudah terhubung ke backend Express.</p>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px"
        }}
      >
        <h2>App Info</h2>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Version:</strong> {data.version}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
      </div>
    </main>
  );
}