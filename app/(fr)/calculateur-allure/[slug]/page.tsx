import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaceGoalPage, { goalCopy } from "../../../pace/PaceGoalPage";
import { GOALS, findGoal, goalPath, goalSlug } from "../../../pace/pace";
import { pageMetadata } from "../../../i18n";

const LOCALE = "fr";

// Static export: only the goals listed in pace.ts exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return GOALS.map((goal) => ({ slug: goalSlug(goal, LOCALE) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const goal = findGoal(slug, LOCALE);
  if (!goal) return {};
  const { title, description } = goalCopy(goal, LOCALE);
  return pageMetadata({
    paths: { en: goalPath(goal, "en"), fr: goalPath(goal, "fr") },
    locale: LOCALE,
    title,
    description,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const goal = findGoal(slug, LOCALE);
  if (!goal) notFound();
  return <PaceGoalPage goal={goal} locale={LOCALE} />;
}
