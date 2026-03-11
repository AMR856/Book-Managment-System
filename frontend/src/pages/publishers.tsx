import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Toast } from "@/components/Toast";
import { useAuth } from "@/lib/auth";
import { createPublisher, deletePublisher, getPublishers } from "@/lib/api";
import { Publisher } from "@/types";

export default function PublishersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "", website: "" });

  const clearToast = () => setToast(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPublishers();
      setPublishers(res.data ?? []);
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to load publishers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this publisher?")) return;
    try {
      await deletePublisher(id);
      setToast({ message: "Publisher deleted", type: "success" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to delete", type: "error" });
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createPublisher({
        name: form.name,
        email: form.email,
        address: form.address || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
      });
      setToast({ message: "Publisher created", type: "success" });
      setShowCreate(false);
      setForm({ name: "", email: "", address: "", phone: "", website: "" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to create publisher", type: "error" });
    }
  };

  return (
    <Layout>
      <Toast message={toast?.message ?? null} type={toast?.type} onClear={clearToast} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Publishers</h2>
        {isAdmin ? (
          <button className="btn primary" onClick={() => setShowCreate((prev) => !prev)}>
            {showCreate ? "Cancel" : "Create publisher"}
          </button>
        ) : null}
      </div>

      {showCreate && (
        <div className="card">
          <h3>New publisher</h3>
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
              <label>Address</label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Website</label>
              <input
                className="input"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
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
          <div className="card">Loading publishers…</div>
        ) : publishers.length === 0 ? (
          <div className="card">No publishers yet.</div>
        ) : (
          publishers.map((publisher) => (
            <div key={publisher.id} className="card">
              <h3>{publisher.name}</h3>
              <p>{publisher.email}</p>
              {publisher.address ? <p>Address: {publisher.address}</p> : null}
              {publisher.phone ? <p>Phone: {publisher.phone}</p> : null}
              {publisher.website ? <p>Website: {publisher.website}</p> : null}
              {isAdmin ? (
                <div className="actions">
                  <button className="btn danger" onClick={() => handleDelete(publisher.id)}>
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
