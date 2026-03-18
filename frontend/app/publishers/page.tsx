export const dynamic = "force-dynamic";

import { getPublishersServer } from "@/lib/serverApi";

export default async function PublishersPage() {
  const publishers = await getPublishersServer();

  return (
    <main className="container">
      <div style={{ marginBottom: "1rem" }}>
        <h2>Publishers</h2>
        <p style={{ color: "var(--muted)" }}>This list is rendered on the server (SSR/ISR) for faster loads and better SEO.</p>
      </div>
      <div>
        {publishers.length === 0 ? (
          <div className="card">No publishers yet.</div>
        ) : (
          publishers.map((publisher: any) => (
            <div key={publisher.id} className="card">
              <h3>{publisher.name}</h3>
              {publisher.website ? (
                <p>
                  Website: <a href={publisher.website}>{publisher.website}</a>
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
