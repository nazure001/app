import BuildForm from "./build-form";
import DeleteBuildButton from "./delete-build-button";
import { getBuilds } from "@/lib/api";

type Build = {
  id: number;
  title: string;
  style: string;
  biome: string;
  createdAt: string;
};

export default async function Home() {
  const builds: Build[] = await getBuilds().catch(() => []);

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
            {builds.map((build) => (
              <li key={build.id} style={{ marginBottom: "16px" }}>
                <strong>{build.title}</strong>
                <br />
                Style: {build.style}
                <br />
                Biome: {build.biome}
                <br />
                Dibuat: {new Date(build.createdAt).toLocaleString()}
                <br />
                <DeleteBuildButton id={build.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}