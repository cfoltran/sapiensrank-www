import type { Metadata } from "next";
import DeleteAccountPage from "../../components/DeleteAccountPage";
import { getDictionary } from "../../dictionaries";
import { pageMetadata } from "../../i18n";

const t = getDictionary("en").meta;

export const metadata: Metadata = pageMetadata({
  route: "deleteAccount",
  locale: "en",
  title: t.deleteTitle,
  description: t.deleteDescription,
});

export default function Page() {
  return <DeleteAccountPage locale="en" />;
}
