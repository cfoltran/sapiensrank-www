import Image from "next/image";
import Link from "next/link";

const screenshots = [
  { src: "/1.PNG", alt: "Today screen" },
  { src: "/2.PNG", alt: "World leaderboard" },
  { src: "/3.PNG", alt: "Battle map" },
  { src: "/4.PNG", alt: "Guild" },
];

const features = [
  { icon: "🏃", text: "Sync your Apple Health data daily: steps, sleep, heart rate, and more." },
  { icon: "🧮", text: "Get a wellness score from 0 to 100, calculated entirely on your device." },
  { icon: "🌍", text: "Rank against users worldwide or filter by country." },
  { icon: "🛡️", text: "Form a guild and fight over a hex world floating in space. Every territory you hold unlocks a member slot." },
  { icon: "⚔️", text: "Wage 24-hour territory battles. Victory goes to the guild with the most real steps, calories, stand hours or exercise minutes every member counts." },
  { icon: "🗳️", text: "War council: propose an attack, your guild has 30 minutes to vote or counter-propose. Silence is consent." },
  { icon: "🧭", text: "Save 1,000 Sapies to colonize a frontier hex and expand the known world or stage a comeback from nothing." },
  { icon: "🏆", text: "Win battles to split a Sapies pool by contribution. The top warrior is crowned Alpha Sapiens." },
  { icon: "📈", text: "Track your score history and spot your trends over time." },
  { icon: "🔒", text: "Your detailed health records stay on your phone. Only daily totals power your score and battles private, never sold." },
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
            Walk. Sleep. <span className="text-lime-300">Conquer.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Your real life powers a game of conquest. Connect Apple Health, earn a
            daily score from your sleep, steps and activity then lead your guild
            to war over a hex world in space, where every real step counts on the
            battlefield.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://apps.apple.com/fr/app/sapiensrank/id6771508578"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex transition-transform hover:-translate-y-0.5"
            >
              <Image
                src="/app-store.svg"
                alt="Download on the App Store"
                width={148}
                height={48}
                priority
              />
            </a>
            <a
              href="https://app.notion.com/p/SapiensRank-roadmap-381b384ee6578129b4c5e6bf4ee1d95e?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Submit an idea
            </a>
          </div>
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
            heart rate variability, calories burned, and more. Your score out of 100 is computed
            on your device, and guild battles are decided by real daily totals the guild that
            actually moved the most wins the territory.
          </p>
          <p className="mt-4">
            Your detailed health records never leave your phone. Only the daily totals needed
            for your score and battles are stored, protected and private. We never sell or share
            your data. Consistent effort beats everything else.
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
