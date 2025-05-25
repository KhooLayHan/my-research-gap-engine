import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import NavBar from "@/components/custom/NavBar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "What's Not Being Researched Engine?",
  description: "Discover the gaps in research with our AI-powered research engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NavBar />
        <main className="flex min-h-screen flex-col items-center justify-start pt-20 p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
