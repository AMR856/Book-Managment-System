"use client";

import { useEffect, useMemo, useState } from "react";
import { Toast } from "@/components/Toast";
import { useAuth } from "@/lib/auth";
import { createBook, deleteBook, getAuthors, getBooks, getPublishers } from "@/lib/api";
import { Author, Book, Publisher } from "@/types";

type Props = {
  initialBooks: Book[];
  initialAuthors: Author[];
  initialPublishers: Publisher[];
};

export default function BooksClient({ initialBooks, initialAuthors, initialPublishers }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState<Book[]>(initialBooks ?? []);
  const [authors, setAuthors] = useState<Author[]>(initialAuthors ?? []);
  const [publishers, setPublishers] = useState<Publisher[]>(initialPublishers ?? []);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    year: "",
    genre: "",
    quantity: "1",
    authorId: "",
    publisherId: "",
  });

  const clearToast = () => setToast(null);

  const load = async () => {
    setLoading(true);
    try {
      const [booksRes, authorsRes, publishersRes] = await Promise.all([getBooks(), getAuthors(), getPublishers()]);
      setBooks(booksRes.data ?? []);
      setAuthors(authorsRes.data ?? []);
      setPublishers(publishersRes.data ?? []);
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to load data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we have the latest data when the component mounts.
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      setToast({ message: "Book deleted", type: "success" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to delete", type: "error" });
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createBook({
        title: form.title,
        isbn: form.isbn,
        year: form.year ? Number(form.year) : undefined,
        genre: form.genre || undefined,
        quantity: Number(form.quantity),
        authorId: Number(form.authorId),
        publisherId: Number(form.publisherId),
      });
      setToast({ message: "Book created", type: "success" });
      setShowCreate(false);
      setForm({ title: "", isbn: "", year: "", genre: "", quantity: "1", authorId: "", publisherId: "" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to create book", type: "error" });
    }
  };

  const authorOptions = useMemo(
    () => authors.map((a) => ({ label: a.name, value: String(a.id) })),
    [authors],
  );

  const publisherOptions = useMemo(
    () => publishers.map((p) => ({ label: p.name, value: String(p.id) })),
    [publishers],
  );

  return (
    <>
      <Toast message={toast?.message ?? null} type={toast?.type} onClear={clearToast} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Books</h2>
        {isAdmin ? (
          <button className="btn primary" onClick={() => setShowCreate((prev) => !prev)}>
            {showCreate ? "Cancel" : "Create book"}
          </button>
        ) : null}
      </div>

      {showCreate && (
        <div className="card">
          <h3>New book</h3>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label>Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>ISBN</label>
              <input
                className="input"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Author</label>
              <select
                className="input"
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                required
              >
                <option value="">Pick an author</option>
                {authorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Publisher</label>
              <select
                className="input"
                value={form.publisherId}
                onChange={(e) => setForm({ ...form, publisherId: e.target.value })}
                required
              >
                <option value="">Pick a publisher</option>
                {publisherOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Year (optional)</label>
              <input
                className="input"
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Genre (optional)</label>
              <input
                className="input"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Quantity</label>
              <input
                className="input"
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
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
          <div className="card">Loading books…</div>
        ) : books.length === 0 ? (
          <div className="card">No books yet.</div>
        ) : (
          books.map((book) => {
            const subtitle = `Author: ${book.author?.name ?? book.authorId} • Publisher: ${book.publisher?.name ?? book.publisherId}`;
            const body = `Quantity: ${book.quantity} • Year: ${book.year ?? "-"} • Genre: ${book.genre ?? "-"}`;
            return (
              <div key={book.id} className="card">
                <h3>{book.title}</h3>
                <p>{subtitle}</p>
                <p>{body}</p>
                {isAdmin ? (
                  <div className="actions">
                    <button className="btn danger" onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
