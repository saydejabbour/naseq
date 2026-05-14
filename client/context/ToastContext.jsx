"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";


const ToastContext = createContext(null);

const colors = {
  success: {
    bg: "#ECFDF3",
    text: "#2F3E34",
    border: "#7CB98B",
    icon: "✓",
  },
  error: {
    bg: "#FEF2F2",
    text: "#991B1B",
    border: "#FCA5A5",
    icon: "✕",
  },
  warning: {
    bg: "#FFF7ED",
    text: "#9A3412",
    border: "#FDBA74",
    icon: "!",
  },
};

export function ToastProvider({ children, duration = 3000 }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text, type = "success") => {
      console.log("SHOW TOAST:", text, type);

      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({
        text: text || "Something happened",
        type,
      });

      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [duration]
  );

  const config = toast ? colors[toast.type] || colors.success : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && config && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "0",
            right: "0",
            zIndex: 999999999,
            display: "flex",
            justifyContent: "center",
            padding: "0 16px",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              minWidth: "280px",
              maxWidth: "420px",
              background: config.bg,
              color: config.text,
              border: `1px solid ${config.border}`,
              borderRadius: "16px",
              padding: "12px 20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.18)",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              pointerEvents: "auto",
            }}
          >
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {config.icon}
            </span>

            <span>{toast.text}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return ctx;
}