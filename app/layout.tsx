// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeSentry — AI Engineering Intelligence Platform",
  description:
    "AI-powered PR review, risk scoring, persona-driven insights, and repository health monitoring. Elevate your engineering workflow.",
  keywords: ["AI code review", "PR analysis", "risk scoring", "repository health", "engineering intelligence"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07071a] text-gray-100 min-h-screen noise-overlay">
        {children}
      </body>
    </html>
  );
}
