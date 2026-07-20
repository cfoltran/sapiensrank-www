import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

const screenshots = [
  { src: "/1.png", alt: "Today screen" },
  { src: "/2.png", alt: "Battle map" },
  { src: "/3.png", alt: "Battle map attack" },
  { src: "/4.png", alt: "Leaderboard" },
  { src: "/5.png", alt: "Presentation page" },
];

const steps = [
  "Sync your Apple Health data daily: steps, sleep, heart rate, and more.",
  "Define your goals.",
  "Turn your calories into Sapies, the in-game money.",
  "Use your Sapies to conquer territories with your friends.",
  "Climb the world leaderboard.",
];


export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">

      <Header />

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
            Your real life powers a game of conquest. Sync Apple Health, turn
            your effort into Sapies, and conquer the world with your friends.
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
              href="https://maroon-gopher-b39.notion.site/5525cc75ef294f70a124137671294680?pvs=105"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Join the Android waitlist
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
          <ol className="flex flex-col gap-5">
            {steps.map((text, i) => (
              <li key={text} className="flex items-start gap-4 text-sm text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-lime-300/10 text-lime-300 text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </div>
      </section>


      <hr className="border-white/10 mx-6 mb-20" />

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Join the <span className="text-lime-300">Arena</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
            Turn your daily effort into conquest. Rally your friends, climb the
            leaderboard and rule the world.
          </p>
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
            />
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-gray-600">
            <span>Free</span>
            <span>·</span>
            <span>iOS 16+</span>
            <span>·</span>
            <span>Requires Apple Health</span>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
