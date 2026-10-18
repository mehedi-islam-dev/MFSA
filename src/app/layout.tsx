import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marine Analytica — Autonomous Marine AI Ecosystem",
    template: "%s | Marine Analytica",
  },
  description:
    "Production-ready fish stock assessment platform powered by AI. Analyze length-weight relationships, compute mortality rates, and export academic-grade reports.",
  keywords: ["fisheries", "stock assessment", "marine biology", "LWR", "Fulton K", "aquaculture", "AI"],
  authors: [{ name: "Marine Analytica Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Marine Analytica",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Marine Analytica — Autonomous Marine AI Ecosystem",
    description: "Fish stock assessment platform powered by AI",
    siteName: "Marine Analytica",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marine Analytica",
    description: "Fish stock assessment platform powered by AI",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#00d4aa",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { GenesisTerminal } from "@/components/ui/GenesisTerminal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased overflow-auto" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
        <GenesisTerminal />
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
