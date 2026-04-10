import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Checklist MVP — plantillas y listas",
  description: "Micro-SaaS de plantillas y checklists (MVP scaffold).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
