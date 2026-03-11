import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Toast } from "@/components/Toast";
import { useAuth } from "@/lib/auth";
import { createOrder, deleteOrder, getBooks, getOrders } from "@/lib/api";
import { Book, Order } from "@/types";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ bookId: "", quantity: "1" });

  const clearToast = () => setToast(null);

  const load = async () => {
    setLoading(true);
    try {
      const [ordersRes, booksRes] = await Promise.all([getOrders(), getBooks()]);
      setOrders(ordersRes.data ?? []);
      setBooks(booksRes.data ?? []);
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to load orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setToast({ message: "Order deleted", type: "success" });
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to delete", type: "error" });
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createOrder({ bookId: Number(form.bookId), quantity: Number(form.quantity) });
      setToast({ message: "Order created", type: "success" });
      setForm({ bookId: "", quantity: "1" });
      setShowCreate(false);
      await load();
    } catch (err: any) {
      setToast({ message: err?.message ?? "Failed to create order", type: "error" });
    }
  };

  const bookOptions = useMemo(
    () => books.map((b) => ({ label: b.title, value: String(b.id) })),
    [books],
  );

  return (
    <Layout>
      <Toast message={toast?.message ?? null} type={toast?.type} onClear={clearToast} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Orders</h2>
        {user ? (
          <button className="btn primary" onClick={() => setShowCreate((prev) => !prev)}>
            {showCreate ? "Cancel" : "Create order"}
          </button>
        ) : null}
      </div>

      {showCreate && (
        <div className="card">
          <h3>New order</h3>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label>Book</label>
              <select
                className="input"
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                required
              >
                <option value="">Pick a book</option>
                {bookOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Quantity</label>
              <input
                className="input"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <button className="btn primary" type="submit">
              Create order
            </button>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <div className="card">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="card">No orders yet.</div>
        ) : (
          orders.map((order) => {
            const book = order.book ?? books.find((b) => b.id === order.bookId);
            const title = book?.title ?? `Book ${order.bookId}`;
            return (
              <div key={order.id} className="card">
                <h3>Order #{order.id}</h3>
                <p>Book: {title}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                <div className="actions">
                  <button className="btn danger" onClick={() => handleDelete(order.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
