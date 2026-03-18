export const dynamic = "force-dynamic";

import BooksClient from "./BooksClient";
import { getAuthorsServer, getBooksServer, getPublishersServer } from "@/lib/serverApi";

export default async function BooksPage() {
  const [books, authors, publishers] = await Promise.all([
    getBooksServer(),
    getAuthorsServer(),
    getPublishersServer(),
  ]);

  return (
    <main className="container">
      <BooksClient initialBooks={books} initialAuthors={authors} initialPublishers={publishers} />
    </main>
  );
}
