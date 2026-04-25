"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

const TOAST_CONFIG = {
  success: {
    className: "bg-green-50 text-green-800 border border-green-200",
    icon: "✓",
  },
  error: {
    className: "bg-red-50 text-red-800 border border-red-200",
    icon: "✕",
  },
};

export function ToastProvider({ children, duration = 3000 }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text, type = "success") => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({ text, type });

      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [duration]
  );

  const config = toast ? (TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.success) : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {toast && config && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 left-1/2 z-[9999]"
          style={{ animation: "toast-in 0.2s ease-out forwards" }}
        >
          <div
            className={`
              flex items-center gap-2
              px-5 py-3 rounded-lg shadow-md text-sm font-medium
              pointer-events-auto
              ${config.className}
            `}
          >
            <span aria-hidden="true">{config.icon}</span>
            {toast.text}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}