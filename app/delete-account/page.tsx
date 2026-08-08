import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-12 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Delete your account</h1>

        <p className="text-lg leading-relaxed">
          You can permanently delete your <strong className="text-white">Sapiens Rank</strong> account
          and all of its associated data at any time, directly from the app.
        </p>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">From the app</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg">
            <li>Open Sapiens Rank and go to your <strong className="text-white">Profile</strong> tab.</li>
            <li>Scroll to the bottom of the page.</li>
            <li>
              Tap <strong className="text-white">Delete account</strong> and confirm. Your account,
              scores and profile data are removed permanently.
            </li>
          </ol>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Need help?</h2>
          <p className="text-lg leading-relaxed">
            If you can&rsquo;t access the app or would rather we handle it for you, email us at{" "}
            <a href="mailto:contact@pommef.com" className="text-blue-400 hover:text-blue-300">
              contact@pommef.com
            </a>{" "}
            and we&rsquo;ll delete your account and data for you.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
