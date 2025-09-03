import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
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
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="px-2 sm:px-4 lg:px-8 py-6 flex flex-1 flex-col items-center">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
