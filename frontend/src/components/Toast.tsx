import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  type?: "info" | "success" | "error";
  onClear: () => void;
  duration?: number;
};

export function Toast({ message, type = "info", onClear, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClear, duration);
    return () => window.clearTimeout(timer);
  }, [message, duration, onClear]);

  if (!message) return null;

  const borderColor = type === "success" ? "var(--accent)" : type === "error" ? "var(--danger)" : "rgba(255,255,255,0.14)";

  return (
    <div className="toast show" style={{ borderColor }}>
      {message}
    </div>
  );
}
