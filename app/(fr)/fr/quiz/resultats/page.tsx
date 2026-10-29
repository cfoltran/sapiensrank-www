import type { Metadata } from "next";
import Leaderboard from "../../../../quiz/Leaderboard";

// The presenter's view of the ranking: no quiz to play first.
export const metadata: Metadata = {
  title: "Classement du quiz",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Leaderboard quizId="talk-ia" />;
}
