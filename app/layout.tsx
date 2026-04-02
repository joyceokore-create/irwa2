import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AnimatedFavicon from "./components/AnimatedFavicon";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "iRWA — Tokenize the Connection",
  description: "Intangible Real World Assets. Tokenize the connection, not the asset.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "iRWA — Tokenize the Connection",
    description: "Intangible Real World Assets. Tokenize the connection, not the asset.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D42B27",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans">
        {/* Skip to main content for keyboard users */}
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:text-white"
          style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}
        >
          Skip to content
        </a>
        <AnimatedFavicon />
        {children}
      </body>
    </html>
  );
}
