import type { Metadata } from "next";
import Link from "next/link";
import { archivo } from "./fonts";
import { SITE_URL } from "./i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "404 · Sapiens Rank",
};

// Static export: the visitor's language is unknown, so both are offered.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">404</p>
        <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
        <p lang="fr" className="text-gray-400 mb-8">Page introuvable</p>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-lime-300 hover:underline">Home</Link>
          <Link href="/fr/" lang="fr" className="text-lime-300 hover:underline">Accueil</Link>
        </div>
      </body>
    </html>
  );
}
