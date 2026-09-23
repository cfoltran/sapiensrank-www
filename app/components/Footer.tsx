import Link from "next/link";
import { getDictionary } from "../dictionaries";
import { routePath, type Locale } from "../i18n";

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale).footer;
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} Sapiens Rank</span>
        <div className="flex flex-wrap gap-4">
          <Link href={routePath("guide", locale)} className="hover:text-gray-400 transition-colors">{t.guide}</Link>
          <a
            href="https://app.notion.com/p/SapiensRank-roadmap-381b384ee6578129b4c5e6bf4ee1d95e?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            {t.idea}
          </a>
          <Link href={routePath("privacy", locale)} className="hover:text-gray-400 transition-colors">{t.privacy}</Link>
          <Link href={routePath("terms", locale)} className="hover:text-gray-400 transition-colors">{t.terms}</Link>
          <a href="mailto:contact@pommef.com" className="hover:text-gray-400 transition-colors">{t.contact}</a>
        </div>
      </div>
    </footer>
  );
}
