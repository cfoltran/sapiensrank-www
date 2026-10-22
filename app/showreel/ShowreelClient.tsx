"use client";

import dynamic from "next/dynamic";

// WebGL, WebCodecs and the URL options only exist in the browser.
const Showreel = dynamic(() => import("./Showreel"), { ssr: false });

export default function ShowreelClient() {
  return <Showreel />;
}
