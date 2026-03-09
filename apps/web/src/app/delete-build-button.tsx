"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBuild } from "@/lib/api";

export default function DeleteBuildButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteBuild(id);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus build");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        marginTop: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        cursor: "pointer"
      }}
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}