import { Noto_Serif } from "next/font/google";

const serif = Noto_Serif({ subsets: ["greek"], style: "italic", weight: "700" });

// A Sapie coin, as in the app's sapie_coin.dart: a gold piece struck with α.
export default function SapieCoin({ size = 16 }: { size?: number }) {
  return (
    <span
      className={`${serif.className} inline-flex items-center justify-center rounded-full shrink-0`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 35% 28%, #FFE9A8 0%, #F1C14E 40%, #CF9626 74%, #A9741A 100%)",
        boxShadow: "0 1px 2px rgba(70,46,8,0.35)",
        color: "#7C5512",
        fontSize: size * 0.6,
        lineHeight: 1,
      }}
    >
      <span style={{ transform: `translate(${-size * 0.02}px, ${-size * 0.05}px)` }}>α</span>
    </span>
  );
}
