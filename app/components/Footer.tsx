import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} Sapiens Rank</span>
        <div className="flex gap-4">
          <a
            href="https://app.notion.com/p/SapiensRank-roadmap-381b384ee6578129b4c5e6bf4ee1d95e?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            Submit an idea
          </a>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-gray-400 transition-colors">Terms &amp; Conditions</Link>
          <a href="mailto:contact@pommef.com" className="hover:text-gray-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
