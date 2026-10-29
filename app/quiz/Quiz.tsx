"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import QuizPodium from "./QuizPodium";
import SapieCoin from "./SapieCoin";
import SapieRain from "./SapieRain";
import {
  rpc,
  type AnswerResult,
  type PodiumPlayer,
  type QuizResult,
  type Question,
  type StartResult,
} from "./rpc";

// What a reload needs to pick up where the player left.
type Saved = {
  playerId: string;
  reward: number;
  questions: Question[];
  index: number;
  sapies: number;
  /** The answer to questions[index], once given. */
  answer: (AnswerResult & { choice: number }) | null;
  /** Past the last question: the result screen. */
  done: boolean;
};

const storageKey = (quizId: string) => `sapiens-quiz:${quizId}`;

function load(quizId: string): Saved | null {
  try {
    const raw = localStorage.getItem(storageKey(quizId));
    const saved = raw ? (JSON.parse(raw) as Saved) : null;
    // A save from another shape of this page starts over rather than crash.
    if (!saved?.playerId || !Array.isArray(saved.questions)) return null;
    if (!(saved.index >= 0 && saved.index < saved.questions.length)) return null;
    return saved;
  } catch {
    return null;
  }
}

function save(quizId: string, saved: Saved | null) {
  try {
    if (saved) localStorage.setItem(storageKey(quizId), JSON.stringify(saved));
    else localStorage.removeItem(storageKey(quizId));
  } catch {}
}

const ERRORS: Record<string, string> = {
  quiz_closed: "Le quiz est terminé. Merci d'avoir joué !",
  quiz_name_required: "Entre ton prénom pour commencer.",
};

function errorText(e: unknown): string {
  const code = e instanceof Error ? e.message : "";
  return ERRORS[code] ?? "Oups, ça n'a pas marché. Réessaie.";
}

function Sapies({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
      <SapieCoin size={size} />
      {value.toLocaleString("fr-FR")}
    </span>
  );
}

function Button({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-lime-300 text-black font-semibold py-4 text-lg transition-opacity disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Intro({ onStart }: { onStart: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      await onStart(name);
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-gray-400 text-lg leading-relaxed">
        Chaque bonne réponse te rapporte <span className="text-white"><Sapies value={100}/> </span>sapies.
        À la fin, tu peux les récupérer dans l&apos;app SapiensRank.
      </p>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim() && !busy) start();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom"
          maxLength={24}
          autoComplete="given-name"
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-lg outline-none focus:border-lime-300"
        />
        {error && <p className="text-sm text-[#FF6B7A]">{error}</p>}
        <Button disabled={!name.trim() || busy}>{busy ? "…" : "C'est parti"}</Button>
      </form>
    </div>
  );
}

function QuestionStep({
  saved,
  onAnswer,
  onNext,
}: {
  saved: Saved;
  onAnswer: (choice: number) => Promise<void>;
  onNext: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const question = saved.questions[saved.index];
  const answer = saved.answer;
  const last = saved.index === saved.questions.length - 1;

  const pick = async (choice: number) => {
    if (busy || answer) return;
    setBusy(true);
    setError(null);
    try {
      await onAnswer(choice);
    } catch (e) {
      setError(errorText(e));
    }
    setBusy(false);
  };

  const choiceStyle = (i: number) => {
    if (!answer) return "border-white/10 bg-white/5 active:bg-white/10";
    if (i === answer.answer) return "border-lime-300 bg-lime-300/15 text-lime-300";
    if (i === answer.choice) return "border-[#FF6B7A] bg-[#FF6B7A]/15 text-[#FF6B7A]";
    return "border-white/5 bg-white/[0.02] text-gray-600";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {saved.index + 1} sur {saved.questions.length}
        </span>
        <span className="text-white">
          <Sapies value={saved.sapies} size={16} />
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-lime-300 transition-all"
          style={{ width: `${((saved.index + (answer ? 1 : 0)) / saved.questions.length) * 100}%` }}
        />
      </div>
      <h2 className="text-2xl font-semibold leading-snug">{question.prompt}</h2>
      <div className="flex flex-col gap-3">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={busy || !!answer}
            className={`w-full text-left rounded-2xl border px-5 py-4 text-lg font-medium transition-colors ${choiceStyle(i)}`}
          >
            {choice}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-[#FF6B7A]">{error}</p>}
      {answer && (
        <div className="flex flex-col gap-4">
          <p className={`text-lg font-semibold ${answer.correct ? "text-lime-300" : "text-[#FF6B7A]"}`}>
            {answer.correct ? (
              <span className="inline-flex items-center gap-2">
                Bonne réponse ! +{saved.reward} <SapieCoin size={18} />
              </span>
            ) : (
              "Raté !"
            )}
          </p>
          {answer.explanation && <p className="text-gray-400 leading-relaxed">{answer.explanation}</p>}
          <Button onClick={onNext}>{last ? "Voir mon résultat" : "Question suivante"}</Button>
        </div>
      )}
    </div>
  );
}

function Result({
  quizId,
  saved,
  badges,
  onLost,
}: {
  quizId: string;
  saved: Saved;
  badges: ReactNode;
  /** The server no longer knows this player (quiz reset after a rehearsal). */
  onLost: () => void;
}) {
  const playerId = saved.playerId;
  const lost = useRef(onLost);
  useEffect(() => {
    lost.current = onLost;
  });
  const [result, setResult] = useState<QuizResult | null>(null);
  const [podium, setPodium] = useState<PodiumPlayer[] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    // The rank and podium move while the rest of the room finishes.
    const refresh = () => {
      // 2 calls per phone every 5 s: none while the tab sits in the background.
      if (document.hidden) return;
      rpc<QuizResult | null>("quiz_result", { p_player: playerId })
        .then((r) => {
          if (!alive) return;
          if (r) setResult(r);
          else lost.current();
        })
        .catch(() => {});
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
  }, [quizId, playerId]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(result.claim_code).then(() => setCopied(true), () => {});
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Ton score</p>
        <p className="text-5xl">
          <Sapies value={result?.sapies ?? saved.sapies} size={44} />
        </p>
        {result && (
          <p className="text-gray-400 mt-3">
            #{result.rank} sur {result.total_players}
          </p>
        )}
      </div>

      {podium && podium.length > 0 && (
        <div>
          <QuizPodium players={podium} />
        </div>
      )}

      {result && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Récupère tes sapies dans l&apos;app</h2>
          <p className="text-gray-400 leading-relaxed">
            Télécharge Sapiens Rank et entre ce code à l&apos;inscription, sur l&apos;écran
            « Un ami t&apos;a invité ? ».
          </p>
          <button
            onClick={copy}
            className="mx-auto rounded-2xl border border-dashed border-lime-300/60 px-6 py-3 text-3xl font-bold tracking-[0.2em] text-lime-300"
          >
            {result.claim_code}
          </button>
          <p className="text-xs text-gray-500">{copied ? "Code copié" : "Touche le code pour le copier"}</p>
          <div className="pt-2">{badges}</div>
        </div>
      )}

      {podium && podium.length > 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Classement</h2>
          <table className="w-full text-left">
            <tbody>
              {podium.slice(3).map((p) => {
                const me = p.rank === result?.rank;
                return (
                  <tr
                    key={p.rank}
                    className={`border-t border-white/5 ${me ? "bg-lime-300/10 text-lime-300" : ""}`}
                  >
                    <td className="py-3 pl-3 w-12 text-gray-500 tabular-nums">#{p.rank}</td>
                    <td className="py-3 font-medium truncate max-w-0 w-full">
                      {p.first_name}
                      {me && " (toi)"}
                    </td>
                    <td className="py-3 pr-3 text-right whitespace-nowrap">
                      <Sapies value={p.sapies} size={14} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Quiz({ quizId, badges }: { quizId: string; badges: ReactNode }) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [ready, setReady] = useState(false);
  const [raining, setRaining] = useState(0);

  useEffect(() => {
    // localStorage only exists in the browser, after the static HTML loads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(load(quizId));
    setReady(true);
  }, [quizId]);

  const update = (next: Saved | null) => {
    setSaved(next);
    save(quizId, next);
  };

  const start = async (name: string) => {
    const r = await rpc<StartResult>("quiz_start", { p_quiz: quizId, p_name: name });
    update({
      playerId: r.player_id,
      reward: r.reward,
      questions: r.questions,
      index: 0,
      sapies: 0,
      answer: null,
      done: false,
    });
  };

  const answer = async (choice: number) => {
    if (!saved) return;
    let r: AnswerResult;
    try {
      r = await rpc<AnswerResult>("quiz_answer", {
        p_player: saved.playerId,
        p_position: saved.questions[saved.index].position,
        p_choice: choice,
      });
    } catch (e) {
      // The quiz was reset since this phone started: back to the intro.
      if (e instanceof Error && /quiz_unknown/.test(e.message)) return update(null);
      throw e;
    }
    update({ ...saved, sapies: r.sapies, answer: { ...r, choice } });
    if (r.correct) {
      setRaining((n) => n + 1);
      navigator.vibrate?.(60);
    }
  };

  const next = () => {
    if (!saved) return;
    const last = saved.index === saved.questions.length - 1;
    update(last ? { ...saved, done: true } : { ...saved, index: saved.index + 1, answer: null });
  };

  return (
    <main className="flex-1 bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-10 min-h-screen flex flex-col justify-center">
        {!ready ? null : !saved ? (
          <Intro onStart={start} />
        ) : saved.done ? (
          <Result quizId={quizId} saved={saved} badges={badges} onLost={() => update(null)} />
        ) : (
          <QuestionStep saved={saved} onAnswer={answer} onNext={next} />
        )}
      </div>
      {raining > 0 && <SapieRain key={raining} onDone={() => setRaining(0)} />}
    </main>
  );
}
