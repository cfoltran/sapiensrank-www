import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuideSelector from "./GuideSelector";

export const metadata: Metadata = {
  title: "Importer vos données de santé — Sapiens Rank",
  description:
    "Guide pas à pas pour envoyer vos données Strava, Garmin Connect, Google Health (Fitbit) ou Samsung Health vers Apple Santé (iPhone) ou Health Connect (Android), afin que Sapiens Rank calcule votre score quotidien.",
};

export default function GuideSante() {
  return (
    <div lang="fr" className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            Guide
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            Importer vos données de santé{" "}
            <span className="text-lime-300">dans Sapiens Rank</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sapiens Rank ne se connecte pas directement à Strava, Garmin ou
            Fitbit. L&apos;app lit une seule source :{" "}
            <strong className="text-white">Apple Santé</strong> sur iPhone,{" "}
            <strong className="text-white">Health Connect</strong> sur Android.
            Choisissez la vôtre ci-dessous.
          </p>
        </div>
      </section>

      {/* Selector */}
      <section className="px-6 pb-16">
        <GuideSelector />
      </section>

      <Footer />
    </div>
  );
}
