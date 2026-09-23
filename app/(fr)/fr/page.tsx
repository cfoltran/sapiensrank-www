import type { Metadata } from "next";
import HomePage from "../../components/HomePage";
import { getDictionary } from "../../dictionaries";
import { pageMetadata } from "../../i18n";

const t = getDictionary("fr").meta;

export const metadata: Metadata = pageMetadata({
  route: "home",
  locale: "fr",
  title: t.homeTitle,
  description: t.homeDescription,
  absoluteTitle: true,
});

export default function Page() {
  return <HomePage locale="fr" />;
}
