import "./globals.css";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IP Subnet Calculator",
  description:
    "Calculate network information from IP addresses and CIDR notation. Professional subnet calculator with binary conversion and network visualization.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IP Subnet Calculator",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "IP Subnet Calculator",
    title: "IP Subnet Calculator",
    description:
      "Professional IP subnet calculator with CIDR notation support, binary conversion, and network visualization",
  },
  twitter: {
    card: "summary",
    title: "IP Subnet Calculator",
    description: "Professional IP subnet calculator with CIDR notation support",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
