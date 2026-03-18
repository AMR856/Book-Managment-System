import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0, fontSize: "1.35rem" }}>Book Management</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
            Simple admin dashboard for books, authors, publishers and orders.
          </p>
        </div>
      </header>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h2>Quick links</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <Link className="btn" href="/books">
            Books
          </Link>
          <Link className="btn" href="/authors">
            Authors
          </Link>
          <Link className="btn" href="/publishers">
            Publishers
          </Link>
          <Link className="btn" href="/orders">
            Orders
          </Link>
          <Link className="btn" href="/login">
            Login
          </Link>
          <Link className="btn" href="/register">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
