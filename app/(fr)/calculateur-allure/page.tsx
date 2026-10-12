import type { Metadata } from "next";
import PacePage from "../../pace/PacePage";
import { getPaceCopy } from "../../pace/paceCopy";
import { pageMetadata } from "../../i18n";

const t = getPaceCopy("fr").meta;

export const metadata: Metadata = pageMetadata({
  route: "pace",
  locale: "fr",
  title: t.title,
  description: t.description,
});

export default function Page() {
  return <PacePage locale="fr" />;
}
