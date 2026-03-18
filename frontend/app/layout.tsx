import "@/styles/globals.css";
import { AppProviders } from "@/components/AppProviders";

export const metadata = {
  title: "Book Management",
  description: "Simple book management dashboard for authors, publishers, orders and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
