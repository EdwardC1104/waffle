import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waffle",
  description: "Waffle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Navbar />
        <main className="px-2 sm:px-4 lg:px-8 py-6">{children}</main>
      </body>
    </html>
  );
}
