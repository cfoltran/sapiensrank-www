import type { Metadata } from "next";
import { archivo } from "../fonts";
import { APP_STORE_ID, SITE_NAME, SITE_URL } from "../i18n";
import { getDictionary } from "../dictionaries";
import "../globals.css";

const t = getDictionary("fr").meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: t.homeTitle, template: `%s · ${SITE_NAME}` },
  description: t.homeDescription,
  applicationName: SITE_NAME,
  // Shows the App Store smart banner in Safari on iPhone.
  itunes: { appId: APP_STORE_ID },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
