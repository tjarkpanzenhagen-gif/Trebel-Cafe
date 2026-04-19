"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Ungültiger Benutzername oder Passwort");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-espresso">Trebelcafé</h1>
          <p className="font-dm text-sm text-espresso/50 mt-1">Admin-Bereich</p>
        </div>
        <div className="bg-white border border-sand rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-dm text-sm text-espresso/70 mb-1.5">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full border border-sand rounded-lg px-4 py-2.5 bg-cream text-espresso font-dm text-sm focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>
            <div>
              <label className="block font-dm text-sm text-espresso/70 mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-sand rounded-lg px-4 py-2.5 bg-cream text-espresso font-dm text-sm focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>
            {error && (
              <p className="font-dm text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white font-dm text-sm py-2.5 rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Anmelden…" : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
