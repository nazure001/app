"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBuild } from "@/lib/api";

export default function BuildForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("Modern");
  const [biome, setBiome] = useState("Forest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBuild({ title, style, biome });
      setTitle("");
      setStyle("Modern");
      setBiome("Forest");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "12px",
        marginTop: "24px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px"
      }}
    >
      <h2>Buat Build Baru</h2>

      <input
        type="text"
        placeholder="Judul build"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <option>Modern</option>
        <option>Medieval</option>
        <option>Fantasy</option>
        <option>Japanese</option>
      </select>

      <select
        value={biome}
        onChange={(e) => setBiome(e.target.value)}
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <option>Forest</option>
        <option>Desert</option>
        <option>Snow</option>
        <option>Mountain</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Menyimpan..." : "Simpan Build"}
      </button>

      {error ? <p style={{ color: "red", margin: 0 }}>{error}</p> : null}
    </form>
  );
}