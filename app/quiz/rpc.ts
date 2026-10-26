// Temporary: the talk quiz, removed after the conference with its
// migration. Same public key as Podium.tsx: only the quiz_* functions are
// reachable with it, the quiz tables have RLS and no policy.
const SUPABASE_URL = "https://bhqwwuzugzpclmhnynia.supabase.co";
const SUPABASE_KEY = "sb_publishable_z0UZc_VzE-3j88x9Z-D6mg_6kJOQH8G";

export async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? String(r.status));
  }
  return r.json();
}

export type Question = { position: number; prompt: string; choices: string[] };

export type StartResult = { player_id: string; reward: number; questions: Question[] };

export type AnswerResult = {
  correct: boolean;
  answer: number;
  explanation: string | null;
  sapies: number;
  finished: boolean;
};

export type QuizResult = {
  sapies: number;
  claim_code: string;
  rank: number;
  total_players: number;
};

export type PodiumPlayer = {
  rank: number;
  first_name: string;
  initials: string;
  sapies: number;
};
