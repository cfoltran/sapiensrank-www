import Image from "next/image";
import Link from "next/link";

const screenshots = [
  { src: "/2.PNG", alt: "Today screen" },
  { src: "/1.PNG", alt: "World leaderboard" },
  { src: "/3.png", alt: "1v1 live challenge" },
  { src: "/4.png", alt: "Victory screen" },
  { src: "/5.PNG", alt: "Battle map" },
  { src: "/6.PNG", alt: "Profile and 30-day trend" },
];

const features = [
  { icon: "🏃", text: "Sync your Apple Health data daily: steps, sleep, heart rate, and more." },
  { icon: "🧮", text: "Get a wellness score from 0 to 100, calculated entirely on your device." },
  { icon: "🌍", text: "Rank against users worldwide or filter by country." },
  { icon: "⚡", text: "Challenge friends 1v1. Whoever scores higher over the period wins." },
  { icon: "📈", text: "Track your score history and spot your trends over time." },
  { icon: "🔒", text: "Your raw health data never leaves your phone." },
];


export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
            <Image src="/AppIcon.png" alt="Sapiens Rank" width={28} height={28} className="rounded-md" />
            <span className="text-sm font-semibold tracking-tight">Sapiens Rank</span>
          </div>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            Sapiens Rank
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            Your body, ranked.{" "}
            <span className="text-gray-400">Globally.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Sapiens Rank turns your daily health data into a score and ranks you
            against people around the world. No cheating. No guesswork. Just your numbers.
          </p>
          <a
            href="https://l.instagram.com/?u=https%3A%2F%2Ftestflight.apple.com%2Fjoin%2Fm2F6JEJ6%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio&e=AUC8ZEWryW_7jO8j0zKWndJl0U72uIjeUwz4ubrWHPP4xK8D_cFg9P11K_0dfyE3kmugqn-MGs36P0xpRppa-PmWhCNS6L-mPQwAESrJQfvqUYt2CPZhbB_JGQUmrxQ-zCnMMjkRKYUIuTeo34pRE75ZYm2E"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5"
          >
            Join the beta
          </a>
        </div>
      </section>

      {/* Screenshots */}
      <section className="pb-20 px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 max-w-5xl mx-auto snap-x snap-mandatory scrollbar-none">
          {screenshots.map((s) => (
            <div
              key={s.src}
              className="flex-shrink-0 snap-center w-[200px] sm:w-[220px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={440}
                height={952}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/10 mx-6 mb-20" />

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-8">
            How it works
          </h2>
          <ul className="flex flex-col gap-5">
            {features.map((f) => (
              <li key={f.text} className="flex items-start gap-4 text-sm text-gray-300 leading-relaxed">
                <span className="text-xl flex-shrink-0 w-7">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </section>


      <hr className="border-white/10 mx-6 mb-20" />

      {/* About */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto text-sm text-gray-400 leading-relaxed">
          <p>
            Sapiens Rank connects to Apple Health to read your daily activity: sleep, steps,
            heart rate variability, calories burned, and more. It computes a single score out of 100
            on your device and submits only that number to our leaderboard.
          </p>
          <p className="mt-4">
            Your raw health data never leaves your phone. We never sell or share your data.
            The ranking is purely based on your daily habits. Consistent effort beats everything else.
          </p>
          <p className="mt-4">
            Want more? Form a guild and conquer hex territories on the battle map. Pick a health metric and a time window. The guild with the highest collective score wins. Each territory you capture unlocks a new member slot. Defenders hold on ties; you have to outperform to conquer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-gray-600">
            <span>Free</span>
            <span>·</span>
            <span>iOS 16+</span>
            <span>·</span>
            <span>Requires Apple Health</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Sapiens Rank</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-400 transition-colors">Terms &amp; Conditions</Link>
            <a href="mailto:contact@pommef.com" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
