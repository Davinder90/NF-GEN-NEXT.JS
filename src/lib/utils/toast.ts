export const toastOptions = {
  duration: 4000,
  style: {
    borderRadius: "0.22rem",
    fontSize: "0.890rem",
    fontWeight: 500,
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fff",
    color: "#111827",
  },
  success: {
    icon: "✅",
    style: {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    },
  },
  error: {
    icon: "❌",
    style: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
  },
  warning: {
    icon: "⚠️",
    style: {
      background: "#fef9c3",
      color: "#92400e",
      border: "1px solid #fde68a",
    },
  },
  info: {
    icon: "ℹ️",
    style: {
      background: "#e0f2fe",
      color: "#075985",
      border: "1px solid #bae6fd",
    },
  },
};
