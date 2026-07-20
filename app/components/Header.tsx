import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/AppIcon.png" alt="Sapiens Rank" width={28} height={28} className="rounded-md" />
        <span className="text-sm font-semibold tracking-tight text-white">Sapiens Rank</span>
      </Link>
    </nav>
  );
}
