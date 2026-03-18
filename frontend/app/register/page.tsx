"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email.trim(), password);
      router.push("/books");
    } catch (err: any) {
      setError(err?.message ?? "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card">
          <h2>Create account</h2>
          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p style={{ marginTop: "1rem", color: "var(--muted)" }}>
            Already have an account? <a href="/login">Login</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
