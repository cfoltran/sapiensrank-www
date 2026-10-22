import type { Metadata } from "next";
import ShowreelClient from "../../showreel/ShowreelClient";

// Internal tool to render the motion-design trailer; kept out of search.
export const metadata: Metadata = {
  title: "Showreel",
  robots: { index: false, follow: false },
};

export default function ShowreelPage() {
  return <ShowreelClient />;
}
