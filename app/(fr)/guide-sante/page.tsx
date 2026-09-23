import type { Metadata } from "next";
import HealthGuidePage from "../../components/HealthGuidePage";
import { getDictionary } from "../../dictionaries";
import { pageMetadata } from "../../i18n";

const t = getDictionary("fr").meta;

export const metadata: Metadata = pageMetadata({
  route: "guide",
  locale: "fr",
  title: t.guideTitle,
  description: t.guideDescription,
});

export default function Page() {
  return <HealthGuidePage locale="fr" />;
}
