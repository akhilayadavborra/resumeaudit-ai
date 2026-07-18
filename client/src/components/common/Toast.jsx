import { Toaster } from "react-hot-toast";
import React from "react";

// Centralized toast styling so it matches the app theme everywhere it's used.
export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1d1c20",
          color: "#e5e7eb",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "0.75rem",
        },
        success: { iconTheme: { primary: "#ffb300", secondary: "#121113" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#121113" } },
      }}
    />
  );
}