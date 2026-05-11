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

  const config = toast ? TOAST_CONFIG[toast.type] || TOAST_CONFIG.success : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && config && (
        <div className="fixed top-6 left-0 right-0 z-[999999] flex justify-center pointer-events-none">
          <div
            role="status"
            aria-live="polite"
            className={`
              flex items-center gap-2
              px-5 py-3 rounded-xl shadow-lg text-sm font-medium
              pointer-events-auto
              animate-[toastIn_0.2s_ease-out]
              ${config.className}
            `}
          >
            <span aria-hidden="true">{config.icon}</span>
            <span>{toast.text}</span>
          </div>

          <style jsx>{`
            @keyframes toastIn {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    return {
      showToast: (text) => alert(text),
    };
  }

  return ctx;
}