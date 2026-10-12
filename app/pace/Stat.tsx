/** One result tile (pace, speed...), on the calculator and the goal pages. */
export default function Stat({
  label,
  value,
  unit,
  large = false,
}: {
  label: string;
  value: string;
  unit: string;
  large?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 px-3 py-4 ${large ? "sm:px-5" : "sm:px-4"}`}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-1">
        <span
          className={`text-2xl font-semibold tabular-nums text-lime-300 ${large ? "sm:text-3xl" : ""}`}
        >
          {value}
        </span>
        <span className="block text-xs text-gray-500">{unit}</span>
      </dd>
    </div>
  );
}
