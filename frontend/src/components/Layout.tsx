"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { label: "Books", href: "/books" },
  { label: "Authors", href: "/authors" },
  { label: "Publishers", href: "/publishers" },
  { label: "Orders", href: "/orders" },
];

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const active = (href: string) => pathname === href;

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0, fontSize: "1.35rem" }}>Book Management</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
            Simple admin dashboard for books, authors, publishers and orders.
          </p>
        </div>
        <div className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={active(item.href) ? "active" : ""}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <button type="button" className="btn" onClick={logout}>
              Logout ({user.email})
            </button>
          ) : (
            <Link href="/login" className={active("/login") ? "active" : ""}>
              Login
            </Link>
          )}
        </div>
      </header>

      {children}
    </div>
  );
}
