import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideDetailPage, { guidePageCopy } from "../../../components/GuideDetailPage";
import { getGuidePage, getGuidePages, guidePagePath } from "../../../components/guidePages";
import { pageMetadata } from "../../../i18n";

const LOCALE = "en";

// Static export: only the pages listed here exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuidePages(LOCALE).map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(LOCALE, slug);
  if (!page) return {};
  const { title, description } = guidePageCopy(page, LOCALE);
  return pageMetadata({
    paths: { en: guidePagePath("en", slug), fr: guidePagePath("fr", slug) },
    locale: LOCALE,
    title,
    description,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getGuidePage(LOCALE, slug);
  if (!page) notFound();
  return <GuideDetailPage page={page} locale={LOCALE} />;
}
