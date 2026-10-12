import type { Metadata } from "next";
import PacePage from "../../pace/PacePage";
import { getPaceCopy } from "../../pace/paceCopy";
import { pageMetadata } from "../../i18n";

const t = getPaceCopy("en").meta;

export const metadata: Metadata = pageMetadata({
  route: "pace",
  locale: "en",
  title: t.title,
  description: t.description,
});

export default function Page() {
  return <PacePage locale="en" />;
}
