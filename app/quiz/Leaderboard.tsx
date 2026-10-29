"use client";

import { useEffect, useState } from "react";
import { Sapies } from "./Quiz";
import QuizPodium from "./QuizPodium";
import { rpc, type PodiumPlayer } from "./rpc";

// The room's ranking for the presenter, without playing the quiz.
export default function Leaderboard({ quizId }: { quizId: string }) {
  const [podium, setPodium] = useState<PodiumPlayer[] | null>(null);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      if (document.hidden) return;
      rpc<PodiumPlayer[]>("quiz_podium", { p_quiz: quizId, lim: 100 })
        .then((p) => alive && setPodium(p))
        .catch(() => {});
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [quizId]);

  return (
    <main className="flex-1 bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen flex flex-col gap-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Classement</h1>
          {podium && (
            <p className="text-gray-400 mt-2">
              {podium.length} {podium.length > 1 ? "joueurs ont" : "joueur a"} terminé
            </p>
          )}
        </div>

        {podium && podium.length > 0 && <QuizPodium players={podium} />}

        {podium && podium.length > 3 && (
          <table className="w-full text-left">
            <tbody>
              {podium.slice(3).map((p) => (
                <tr key={p.rank} className="border-t border-white/5">
                  <td className="py-3 pl-3 w-12 text-gray-500 tabular-nums">#{p.rank}</td>
                  <td className="py-3 font-medium truncate max-w-0 w-full">{p.first_name}</td>
                  <td className="py-3 pr-3 text-right whitespace-nowrap">
                    <Sapies value={p.sapies} size={14} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
