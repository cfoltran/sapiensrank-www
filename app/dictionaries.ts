import type { Locale } from "./i18n";

const en = {
  meta: {
    homeTitle: "Sapiens Rank — The fitness game that turns your health into conquest",
    homeDescription:
      "Sapiens Rank turns your steps, sleep and heart rate into a daily health score. Earn Sapies, conquer territories with your guild and climb the world leaderboard. Free on iOS and Android.",
    guideTitle: "Sync your health data: Garmin, Fitbit, Strava, COROS",
    guideDescription:
      "Step-by-step guide to send your Garmin Connect, Google Health (Fitbit), Strava or COROS data to Apple Health (iPhone) or Health Connect (Android), so Sapiens Rank can compute your daily score.",
    deleteTitle: "Delete your account",
    deleteDescription:
      "How to permanently delete your Sapiens Rank account and all of its data, from the app or by email.",
  },
  header: {
    home: "Sapiens Rank home",
    switchLabel: "Français",
    switchShort: "FR",
  },
  footer: {
    guide: "Health data guide",
    idea: "Submit an idea",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    contact: "Contact",
  },
  stores: {
    appStore: "Download on the App Store",
    googlePlay: "Get it on Google Play",
  },
  home: {
    heroTitle: "Burn calories.",
    heroAccent: "Fuel your empire.",
    heroText:
      "Your real life powers a game of conquest. Sync your health app, turn your effort into Sapies, and conquer the world with your friends.",
    screenshots: [
      "Today screen with the daily health score",
      "Battle map",
      "Attacking a territory on the battle map",
      "World leaderboard",
      "Presentation page",
    ],
    howItWorks: "How it works",
    steps: [
      "Sync your health app data daily: steps, sleep, heart rate, and more.",
      "Define your goals.",
      "Turn your calories into Sapies, the in-game money.",
      "Use your Sapies to conquer territories with your friends.",
      "Climb the world leaderboard.",
    ],
    guideLink: "Using Garmin, Fitbit, Strava or COROS? See how to sync them",
    ctaTitle: "Join the",
    ctaAccent: "Arena",
    ctaText:
      "Turn your daily effort into conquest. Rally your friends, climb the leaderboard and rule the world.",
    badges: ["Free", "iOS 16+ · Android", "Requires a health app"],
  },
  podium: {
    eyebrow: "World Leaderboard",
    title: "Today’s top Sapiens",
  },
  guide: {
    eyebrow: "Guide",
    title: "Sync your health data",
    titleAccent: "with Sapiens Rank",
    intro: {
      before:
        "Sapiens Rank does not connect directly to Strava, Garmin or Fitbit. The app reads a single source: ",
      ios: "Apple Health",
      middle: " on iPhone, ",
      android: "Health Connect",
      after: " on Android. Pick yours below.",
    },
  },
  deleteAccount: {
    title: "Delete your account",
    intro:
      "You can permanently delete your Sapiens Rank account and all of its associated data at any time, directly from the app.",
    fromApp: "From the app",
    steps: [
      "Open Sapiens Rank and go to your Profile tab.",
      "Scroll to the bottom of the page.",
      "Tap Delete account and confirm. Your account, scores and profile data are removed permanently.",
    ],
    help: "Need help?",
    helpBefore:
      "If you can’t access the app or would rather we handle it for you, email us at ",
    helpAfter: " and we’ll delete your account and data for you.",
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  meta: {
    homeTitle: "Sapiens Rank — Le jeu fitness qui transforme votre santé en conquête",
    homeDescription:
      "Sapiens Rank transforme vos pas, votre sommeil et votre fréquence cardiaque en score santé quotidien. Gagnez des Sapies, conquérez des territoires avec votre guilde et grimpez au classement mondial. Gratuit sur iOS et Android.",
    guideTitle: "Importer vos données de santé : Garmin, Fitbit, Strava, COROS",
    guideDescription:
      "Guide pas à pas pour envoyer vos données Garmin Connect, Google Health (Fitbit), Strava ou COROS vers Apple Santé (iPhone) ou Health Connect (Android), afin que Sapiens Rank calcule votre score quotidien.",
    deleteTitle: "Supprimer votre compte",
    deleteDescription:
      "Comment supprimer définitivement votre compte Sapiens Rank et toutes ses données, depuis l'app ou par e-mail.",
  },
  header: {
    home: "Accueil Sapiens Rank",
    switchLabel: "English",
    switchShort: "EN",
  },
  footer: {
    guide: "Guide des données santé",
    idea: "Proposer une idée",
    privacy: "Confidentialité (EN)",
    terms: "Conditions (EN)",
    contact: "Contact",
  },
  stores: {
    appStore: "Télécharger dans l'App Store",
    googlePlay: "Disponible sur Google Play",
  },
  home: {
    heroTitle: "Brûlez des calories.",
    heroAccent: "Bâtissez votre empire.",
    heroText:
      "Votre vraie vie alimente un jeu de conquête. Synchronisez votre app santé, transformez vos efforts en Sapies et conquérez le monde avec vos amis.",
    screenshots: [
      "Écran du jour avec le score santé quotidien",
      "Carte de bataille",
      "Attaque d'un territoire sur la carte de bataille",
      "Classement mondial",
      "Page de présentation",
    ],
    howItWorks: "Comment ça marche",
    steps: [
      "Synchronisez chaque jour les données de votre app santé : pas, sommeil, fréquence cardiaque, et plus.",
      "Définissez vos objectifs.",
      "Transformez vos calories en Sapies, la monnaie du jeu.",
      "Utilisez vos Sapies pour conquérir des territoires avec vos amis.",
      "Grimpez au classement mondial.",
    ],
    guideLink: "Vous utilisez Garmin, Fitbit, Strava ou COROS ? Voir comment les synchroniser",
    ctaTitle: "Entrez dans",
    ctaAccent: "l'Arène",
    ctaText:
      "Transformez vos efforts quotidiens en conquête. Rassemblez vos amis, grimpez au classement et dominez le monde.",
    badges: ["Gratuit", "iOS 16+ · Android", "Nécessite une app santé"],
  },
  podium: {
    eyebrow: "Classement mondial",
    title: "Le top Sapiens du jour",
  },
  guide: {
    eyebrow: "Guide",
    title: "Importer vos données de santé",
    titleAccent: "dans Sapiens Rank",
    intro: {
      before:
        "Sapiens Rank ne se connecte pas directement à Strava, Garmin ou Fitbit. L'app lit une seule source : ",
      ios: "Apple Santé",
      middle: " sur iPhone, ",
      android: "Health Connect",
      after: " sur Android. Choisissez la vôtre ci-dessous.",
    },
  },
  deleteAccount: {
    title: "Supprimer votre compte",
    intro:
      "Vous pouvez supprimer définitivement votre compte Sapiens Rank et toutes les données associées à tout moment, directement depuis l'app.",
    fromApp: "Depuis l'app",
    steps: [
      "Ouvrez Sapiens Rank et allez dans l'onglet Profil.",
      "Descendez tout en bas de la page.",
      "Touchez Supprimer le compte et confirmez. Votre compte, vos scores et vos données de profil sont supprimés définitivement.",
    ],
    help: "Besoin d'aide ?",
    helpBefore:
      "Si vous n'avez plus accès à l'app ou préférez qu'on s'en charge, écrivez-nous à ",
    helpAfter: " et nous supprimerons votre compte et vos données pour vous.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
