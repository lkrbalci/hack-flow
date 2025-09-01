import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/QueryProvider/QueryProvider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Hackathon Flow Tracker",
  description: "Track hackathon progress",
  generator: "BeeNest Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <body className="font-sans">
        <Suspense fallback={null}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
