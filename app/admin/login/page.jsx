"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Koneksi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-container px-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-lg w-full max-w-[400px] border border-outline-variant/20">
        <div className="text-center mb-lg">
          <div className="w-16 h-16 rounded-full bg-primary-container/15 flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-primary text-[36px]">
              shield_person
            </span>
          </div>
          <h1 className="font-section-title text-section-title font-bold text-on-surface">
            Admin Login
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            Jorong Padang Panjang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
              placeholder="Masukkan password admin"
            />
          </div>

          {error && (
            <div className="bg-error-container/20 text-on-error-container rounded-lg px-4 py-2 font-label-sm text-label-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary-button text-on-primary font-label-sm text-label-sm py-3 rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-lg text-center">
          <a
            href="/"
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            ← Kembali ke Website
          </a>
        </div>
      </div>
    </div>
  );
}
