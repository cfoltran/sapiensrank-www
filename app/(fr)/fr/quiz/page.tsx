import type { Metadata } from "next";
import Quiz from "../../../quiz/Quiz";
import StoreBadges from "../../../components/StoreBadges";

// Temporary page for a conference talk: left out of ROUTES and the sitemap.
export const metadata: Metadata = {
  title: "Quiz IA",
  description: "Le quiz du talk : gagne des sapies et récupère-les dans Sapiens Rank.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Quiz quizId="talk-ia" badges={<StoreBadges locale="fr" />} />;
}
