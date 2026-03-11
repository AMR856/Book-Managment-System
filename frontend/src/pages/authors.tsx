import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Toast } from "@/components/Toast";
import { useAuth } from "@/lib/auth";
import { createAuthor, deleteAuthor, getAuthors } from "@/lib/api";
import { Author } from "@/types";

export default function AuthorsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", nationality: "", biography: "" });

  const clearToast = () => setToast(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAuthors();
      setAuthors(res.data ?? []);
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to load authors", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this author?")) return;
    try {
      await deleteAuthor(id);
      setToast({ message: "Author deleted", type: "success" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to delete", type: "error" });
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createAuthor({
        name: form.name,
        email: form.email,
        nationality: form.nationality || undefined,
        biography: form.biography || undefined,
      });
      setToast({ message: "Author created", type: "success" });
      setShowCreate(false);
      setForm({ name: "", email: "", nationality: "", biography: "" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to create author", type: "error" });
    }
  };

  return (
    <Layout>
      <Toast message={toast?.message ?? null} type={toast?.type} onClear={clearToast} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Authors</h2>
        {isAdmin ? (
          <button className="btn primary" onClick={() => setShowCreate((prev) => !prev)}>
            {showCreate ? "Cancel" : "Create author"}
          </button>
        ) : null}
      </div>

      {showCreate && (
        <div className="card">
          <h3>New author</h3>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label>Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Nationality</label>
              <input
                className="input"
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Biography</label>
              <textarea
                className="input"
                value={form.biography}
                onChange={(e) => setForm({ ...form, biography: e.target.value })}
                rows={4}
              />
            </div>
            <button className="btn primary" type="submit">
              Create
            </button>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <div className="card">Loading authors…</div>
        ) : authors.length === 0 ? (
          <div className="card">No authors yet.</div>
        ) : (
          authors.map((author) => (
            <div key={author.id} className="card">
              <h3>{author.name}</h3>
              <p>{author.email}</p>
              {author.nationality ? <p>Nationality: {author.nationality}</p> : null}
              {author.biography ? <p>{author.biography}</p> : null}
              {isAdmin ? (
                <div className="actions">
                  <button className="btn danger" onClick={() => handleDelete(author.id)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
