import Image from "next/image";
import { getDictionary } from "../dictionaries";
import { STORE_LINKS, type Locale } from "../i18n";

export default function StoreBadges({
  locale,
  priority = false,
}: {
  locale: Locale;
  priority?: boolean;
}) {
  const t = getDictionary(locale).stores;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href={STORE_LINKS.ios[locale]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-transform hover:-translate-y-0.5"
      >
        <Image src="/app-store.svg" alt={t.appStore} width={148} height={48} priority={priority} />
      </a>
      <a
        href={STORE_LINKS.android}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-transform hover:-translate-y-0.5"
      >
        <Image src="/googleplay.png" alt={t.googlePlay} width={162} height={48} priority={priority} />
      </a>
    </div>
  );
}
