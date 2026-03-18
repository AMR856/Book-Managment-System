export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiResponse<T> = {
  status: string;
  data: T;
  message?: string;
};

const parseJson = async (res: Response) => {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

const fetchJson = async <T>(path: string, opts: RequestInit = {}, revalidateSeconds = 60): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    next: {
      revalidate: revalidateSeconds,
    },
    ...opts,
  });

  const body = (await parseJson(res)) as any;
  if (!res.ok) {
    const message = body?.message || body?.error || res.statusText;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return body?.data ?? body;
};

export const getBooksServer = (revalidateSeconds = 60) => fetchJson<any[]>("/books", {}, revalidateSeconds);
export const getAuthorsServer = (revalidateSeconds = 60) => fetchJson<any[]>("/authors", {}, revalidateSeconds);
export const getPublishersServer = (revalidateSeconds = 60) => fetchJson<any[]>("/publishers", {}, revalidateSeconds);
export const getOrdersServer = (revalidateSeconds = 60) => fetchJson<any[]>("/orders", {}, revalidateSeconds);
