import BuildForm from "./build-form";
import { getBuilds } from "@/lib/api";

export default async function Home() {
  const builds = await getBuilds().catch(() => []);

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

      <BuildForm />

      <section
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px"
        }}
      >
        <h2>Daftar Build</h2>

        {builds.length === 0 ? (
          <p>Belum ada data build.</p>
        ) : (
          <ul style={{ paddingLeft: "20px" }}>
            {builds.map((build: any) => (
              <li key={build.id} style={{ marginBottom: "12px" }}>
                <strong>{build.title}</strong>
                <br />
                Style: {build.style}
                <br />
                Biome: {build.biome}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}