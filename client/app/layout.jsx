import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <Script
  src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
  strategy="afterInteractive"
/>

<Script
  src="https://files.bpcontent.cloud/2026/05/13/11/20260513112214-ZYECEDV8.js"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}