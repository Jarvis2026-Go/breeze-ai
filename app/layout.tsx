import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "CHOG Financial Dashboard | Breeze AI",
  description: "Financial analysis dashboard for CHOG restaurant (2023-2025)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="max-w-[1600px] mx-auto min-h-screen pt-4 pb-12 px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
