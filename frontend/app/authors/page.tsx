export const dynamic = "force-dynamic";

import { getAuthorsServer } from "@/lib/serverApi";

export default async function AuthorsPage() {
  const authors = await getAuthorsServer();

  return (
    <main className="container">
      <div style={{ marginBottom: "1rem" }}>
        <h2>Authors</h2>
        <p style={{ color: "var(--muted)" }}>This list is rendered on the server (SSR/ISR) for faster loads and better SEO.</p>
      </div>
      <div>
        {authors.length === 0 ? (
          <div className="card">No authors yet.</div>
        ) : (
          authors.map((author: any) => (
            <div key={author.id} className="card">
              <h3>{author.name}</h3>
              <p>{author.email}</p>
              {author.nationality ? <p>Nationality: {author.nationality}</p> : null}
              {author.biography ? <p>{author.biography}</p> : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
