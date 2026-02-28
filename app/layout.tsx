import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { PasswordGate } from "@/components/password-gate";

export const metadata: Metadata = {
  title: "CHOG Financial Dashboard | Breeze",
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
        <PasswordGate>
          <Navbar />
          <main className="max-w-[1600px] mx-auto min-h-screen pt-4 pb-12 px-8">
            {children}
          </main>
        </PasswordGate>
      </body>
    </html>
  );
}
