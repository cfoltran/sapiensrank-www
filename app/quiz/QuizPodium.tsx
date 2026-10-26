import SapieCoin from "./SapieCoin";
import type { PodiumPlayer } from "./rpc";

// Same look as components/Podium.tsx, fed by the quiz players.
const AVATAR_PALETTE = [
  "#FF6B7A", "#7CB6FF", "#F0A64A", "#C5A3FF", "#9BE7C4", "#FFB84A",
  "#7CE5FF", "#FF9B7A", "#D9FF3D", "#B5A8FF", "#F5D76E", "#FF7AD9",
];

const SLOTS = [
  { rank: 2, blockHeight: 100, color: "#E0D5B8", avatarSize: 50 },
  { rank: 1, blockHeight: 130, color: "#D9FF3D", avatarSize: 60 },
  { rank: 3, blockHeight: 86, color: "#F0A64A", avatarSize: 50 },
];

function avatarColor(seed: string): string {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export default function QuizPodium({ players }: { players: PodiumPlayer[] }) {
  return (
    <div className="flex items-end gap-2.5">
      {SLOTS.map(({ rank, blockHeight, color, avatarSize }) => {
        const player = players.find((p) => p.rank === rank);
        const avatar = player ? avatarColor(player.first_name) : "#ffffff";
        return (
          <div key={rank} className="flex-1 min-w-0 flex flex-col items-center justify-end">
            {rank === 1 ? <span style={{ fontSize: 22 }}>👑</span> : <div style={{ height: 26 }} />}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: avatarSize,
                height: avatarSize,
                background: player
                  ? `linear-gradient(135deg, ${avatar}, ${avatar}AA)`
                  : "rgba(255,255,255,0.05)",
              }}
            >
              <span className="font-bold" style={{ fontSize: avatarSize * 0.36, color: "#15130F" }}>
                {player?.initials}
              </span>
            </div>
            <p
              className="mt-1.5 font-semibold text-center truncate max-w-full px-1"
              style={{ fontSize: 12, color: "#F5F1E8" }}
            >
              {player?.first_name ?? "?"}
            </p>
            <p
              className="inline-flex items-center gap-1 font-semibold"
              style={{ fontSize: 11, color: "rgba(245,241,232,0.6)", minHeight: 16 }}
            >
              {player && (
                <>
                  <SapieCoin size={12} />
                  {player.sapies.toLocaleString("fr-FR")}
                </>
              )}
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
                  boxShadow: rank === 1 ? `0 0 12px ${color}` : undefined,
                }}
              />
              <div className="absolute inset-x-0 flex justify-center" style={{ top: 14 }}>
                <span className="font-bold leading-none" style={{ fontSize: rank === 1 ? 32 : 24, color }}>
                  #{rank}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
