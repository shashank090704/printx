// FILE: apps/web/app/layout.tsx
// Root layout — loads Razorpay SDK globally, sets up fonts + metadata

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartPrint — Print shop",
  description: "Upload, configure, and track your print orders online.",
  themeColor: "#0f0e0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Razorpay checkout SDK — loaded globally so checkout page can use window.Razorpay */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}