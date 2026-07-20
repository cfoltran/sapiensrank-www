"use client";

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://bhqwwuzugzpclmhnynia.supabase.co";
// Public publishable key — safe to ship to the browser. Only the `podium`
// RPC is reachable with it; every table stays RLS-protected.
const SUPABASE_KEY = "sb_publishable_z0UZc_VzE-3j88x9Z-D6mg_6kJOQH8G";

type Player = {
  rank: number;
  first_name: string;
  handle: string;
  initials: string;
  score: number;
  country: string | null;
  rank_delta: number | null;
};

const mono = { fontFamily: "var(--font-geist-mono)" } as const;

const AVATAR_PALETTE = [
  "#FF6B7A", "#7CB6FF", "#F0A64A", "#C5A3FF", "#9BE7C4", "#FFB84A",
  "#7CE5FF", "#FF9B7A", "#D9FF3D", "#B5A8FF", "#F5D76E", "#FF7AD9",
];

function avatarColor(seed: string): string {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function countryFlag(code: string | null): string | null {
  if (!code || code.length !== 2) return null;
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 0x1f1e6 - 0x41))
    .join("");
}

function Avatar({ player, size }: { player: Player; size: number }) {
  const color = avatarColor(player.handle);
  const flag = countryFlag(player.country);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color}, ${color}AA)`,
        }}
      >
        <span
          className="font-bold"
          style={{ fontSize: size * 0.36, color: "#15130F" }}
        >
          {player.initials}
        </span>
      </div>
      {flag && (
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: size * 0.38,
            height: size * 0.38,
            right: -2,
            bottom: -2,
            background: "#15130F",
          }}
        >
          <span style={{ fontSize: size * 0.22 }}>{flag}</span>
        </div>
      )}
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-0.5 font-bold"
      style={{
        ...mono,
        fontSize: 10,
        background: positive ? "#D9FF3D" : "rgba(255,107,122,0.25)",
        color: positive ? "#15130F" : "#FF6B7A",
      }}
    >
      {positive ? `↑${delta}` : `↓${Math.abs(delta)}`}
    </span>
  );
}

function Slot({
  player,
  blockHeight,
  color,
  avatarSize,
  crown = false,
}: {
  player: Player;
  blockHeight: number;
  color: string;
  avatarSize: number;
  crown?: boolean;
}) {
  const isFirst = player.rank === 1;
  return (
    <div className="flex-1 flex flex-col items-center justify-end">
      {crown ? (
        <span style={{ fontSize: 22 }}>👑</span>
      ) : (
        <div style={{ height: 26 }} />
      )}
      <Avatar player={player} size={avatarSize} />
      <p
        className="mt-1.5 font-semibold text-center truncate max-w-full px-1"
        style={{ fontSize: 12, color: "#F5F1E8" }}
      >
        {player.first_name}
      </p>
      <p
        className="text-center truncate max-w-full px-1"
        style={{ ...mono, fontSize: 9, color: "rgba(245,241,232,0.38)" }}
      >
        @{player.handle}
      </p>
      <div
        className="mt-1.5 w-full relative overflow-hidden"
        style={{
          height: blockHeight,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          background: `linear-gradient(to bottom, ${color}22, ${color}08)`,
          borderTop: `1px solid ${color}44`,
          borderLeft: `1px solid ${color}44`,
          borderRight: `1px solid ${color}44`,
        }}
      >
        <div
          className="absolute"
          style={{
            top: 0,
            left: 8,
            right: 8,
            height: 2,
            borderRadius: 2,
            background: color,
            boxShadow: isFirst ? `0 0 12px ${color}` : undefined,
          }}
        />
        <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: 14 }}>
          <span
            className="font-bold leading-none"
            style={{ fontSize: isFirst ? 32 : 24, color }}
          >
            #{player.rank}
          </span>
          <span className="mt-1" style={{ ...mono, fontSize: 10, color: "#9EF5F1E8" }}>
            {Math.round(player.score)}
          </span>
          {player.rank_delta != null && player.rank_delta !== 0 && (
            <span className="mt-1.5">
              <DeltaBadge delta={player.rank_delta} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PodiumSkeleton() {
  const heights = [100, 130, 86];
  return (
    <div className="flex items-end gap-2.5 animate-pulse">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end">
          <div className="rounded-full bg-white/5" style={{ width: 50, height: 50 }} />
          <div className="mt-2 h-3 w-12 rounded bg-white/5" />
          <div
            className="mt-2 w-full bg-white/5"
            style={{ height: h, borderTopLeftRadius: 14, borderTopRightRadius: 14 }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Podium() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/rpc/podium?lim=3`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: Player[]) => setPlayers(rows))
      .catch(() => setFailed(true));
  }, []);

  // Hide the whole section if we can't render a real podium.
  if (failed || (players && players.length < 3)) return null;

  const p1 = players?.[0];
  const p2 = players?.[1];
  const p3 = players?.[2];

  return (
    <section className="pb-20 px-6">
      <div className="max-w-sm mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 text-center">
          World Leaderboard
        </p>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Today&rsquo;s top Sapiens
        </h2>
        {!players ? (
          <PodiumSkeleton />
        ) : (
          <div className="flex items-end gap-2.5">
            <Slot player={p2!} blockHeight={100} color="#E0D5B8" avatarSize={50} />
            <Slot player={p1!} blockHeight={130} color="#D9FF3D" avatarSize={60} crown />
            <Slot player={p3!} blockHeight={86} color="#F0A64A" avatarSize={50} />
          </div>
        )}
      </div>
    </section>
  );
}
