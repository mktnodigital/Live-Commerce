import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud-Native Next.js | Google Cloud",
  description: "Arquitetura otimizada para Cloud Run e Cloud Build",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
