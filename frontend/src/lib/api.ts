import { getToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type ApiResponse<T> = {
  status: string;
  data: T;
  message?: string;
};

export type ErrorResponse = {
  status: string;
  message: string;
};

const parseJson = async (res: Response) => {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

export const authFetch = async <T = any>(
  path: string,
  opts: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  const body = (await parseJson(res)) as any;

  if (!res.ok) {
    const message = body?.message || body?.error || res.statusText;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return body;
};

export const login = (email: string, password: string) =>
  authFetch<{ user: any; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (email: string, password: string) =>
  authFetch<{ user: any; token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const fetchProfile = () => authFetch<{ user: any }>("/api/auth/profile");

export const logout = () => authFetch<null>("/api/auth/logout", { method: "POST" });

export const getBooks = () => authFetch<any[]>("/books");
export const deleteBook = (id: number) => authFetch<null>(`/books/${id}`, { method: "DELETE" });
export const createBook = (data: any) => authFetch<any>("/books", { method: "POST", body: JSON.stringify(data) });

export const getAuthors = () => authFetch<any[]>("/authors");
export const createAuthor = (data: any) => authFetch<any>("/authors", { method: "POST", body: JSON.stringify(data) });
export const deleteAuthor = (id: number) => authFetch<null>(`/authors/${id}`, { method: "DELETE" });

export const getPublishers = () => authFetch<any[]>("/publishers");
export const createPublisher = (data: any) => authFetch<any>("/publishers", { method: "POST", body: JSON.stringify(data) });
export const deletePublisher = (id: number) => authFetch<null>(`/publishers/${id}`, { method: "DELETE" });

export const getOrders = () => authFetch<any[]>("/orders");
export const createOrder = (data: any) => authFetch<any>("/orders", { method: "POST", body: JSON.stringify(data) });
export const deleteOrder = (id: number) => authFetch<null>(`/orders/${id}`, { method: "DELETE" });
