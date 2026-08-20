import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentryCircle | Scam defense that acts",
  description: "A real-time scam and impersonation defense prototype."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

