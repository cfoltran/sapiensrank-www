import type { Locale } from "./i18n";

const en = {
  meta: {
    homeTitle: "Sapiens Rank: move in real life, level up in the game with your friends",
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
    pace: "Pace calculator",
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
    heroTitle: "Move in real life,",
    heroAccent: "level up in the game with your friends.",
    heroText:
      "Sync your health app, turn your effort into Sapies and conquer the world with your guild.",
    screenshots: [
      "Today screen with the daily health score",
      "Battle map",
      "Attacking a territory on the battle map",
      "World leaderboard",
      "Presentation page",
    ],
    tourVideo: "Video tour of the app",
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
    badges: ["Free", "iOS 16+ and Android", "Requires a health app"],
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
  guidePage: {
    title: (app: string, hub: string, phone: string) =>
      `Sync ${app} with ${hub} (${phone})`,
    description: (app: string, hub: string, phone: string, data: string) =>
      `Illustrated steps to send ${data} from ${app} to ${hub} on ${phone}, so they count toward your Sapiens Rank daily score.`,
    intro: (app: string, hub: string, data: string) =>
      `${app} does not send its data to Sapiens Rank directly: it goes through ${hub}, which the app reads every day. Once connected, ${data} flow into your score automatically.`,
    and: "and",
    your: "your",
    yourData: "your data",
    breadcrumb: "Health data guide",
    allApps: "All apps",
    appOnPhone: (app: string, phone: string) => `${app} on ${phone}`,
    otherPhoneTitle: "Another phone?",
    otherApps: "Other apps",
    nextTitle: "What next?",
    next: (app: string, hub: string) =>
      `Open Sapiens Rank: your data is read every time the app opens. If nothing shows up, check in ${hub} that ${app} is allowed to write every category.`,
    ctaTitle: "Not on Sapiens Rank yet?",
    ctaText:
      "Turn your steps, sleep and workouts into Sapies, conquer territories with your friends and climb the world leaderboard.",
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
    homeTitle: "Sapiens Rank : bouge dans la vraie vie, avance dans le jeu avec tes amis",
    homeDescription:
      "Sapiens Rank transforme tes pas, ton sommeil et ta fréquence cardiaque en score santé quotidien. Gagne des Sapies, conquiers des territoires avec ta guilde et grimpe au classement mondial. Gratuit sur iOS et Android.",
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
    pace: "Calculateur d'allure",
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
    heroTitle: "Bouge dans la vraie vie,",
    heroAccent: "avance dans le jeu avec tes amis.",
    heroText:
      "Synchronise ton app santé, transforme tes efforts en Sapies et conquiers le monde avec ta guilde.",
    screenshots: [
      "Écran du jour avec le score santé quotidien",
      "Carte de bataille",
      "Attaque d'un territoire sur la carte de bataille",
      "Classement mondial",
      "Page de présentation",
    ],
    tourVideo: "Visite vidéo de l'app",
    howItWorks: "Comment ça marche",
    steps: [
      "Synchronise chaque jour les données de ton app santé : pas, sommeil, fréquence cardiaque, et plus.",
      "Définis tes objectifs.",
      "Transforme tes calories en Sapies, la monnaie du jeu.",
      "Utilise tes Sapies pour conquérir des territoires avec tes amis.",
      "Grimpe au classement mondial.",
    ],
    guideLink: "Tu utilises Garmin, Fitbit, Strava ou COROS ? Vois comment les synchroniser",
    ctaTitle: "Entre dans",
    ctaAccent: "l'Arène",
    ctaText:
      "Transforme tes efforts quotidiens en conquête. Rassemble tes amis, grimpe au classement et domine le monde.",
    badges: ["Gratuit", "iOS 16+ et Android", "Nécessite une app santé"],
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
  guidePage: {
    title: (app: string, hub: string, phone: string) =>
      `Synchroniser ${app} avec ${hub} (${phone})`,
    description: (app: string, hub: string, phone: string, data: string) =>
      `Étapes illustrées pour envoyer ${data} de ${app} vers ${hub} sur ${phone}, et les faire compter dans votre score quotidien Sapiens Rank.`,
    intro: (app: string, hub: string, data: string) =>
      `${app} n'envoie pas ses données directement à Sapiens Rank : elles passent par ${hub}, que l'app lit chaque jour. Une fois la connexion faite, ${data} remontent automatiquement dans votre score.`,
    and: "et",
    your: "vos",
    yourData: "vos données",
    breadcrumb: "Guide des données santé",
    allApps: "Toutes les applications",
    appOnPhone: (app: string, phone: string) => `${app} sur ${phone}`,
    otherPhoneTitle: "Un autre téléphone ?",
    otherApps: "Autres applications",
    nextTitle: "Et ensuite ?",
    next: (app: string, hub: string) =>
      `Ouvrez Sapiens Rank : vos données sont lues à chaque ouverture de l'app. Si rien n'apparaît, vérifiez dans ${hub} que ${app} a bien le droit d'écrire chaque catégorie.`,
    ctaTitle: "Pas encore sur Sapiens Rank ?",
    ctaText:
      "Transformez vos pas, votre sommeil et vos séances en Sapies, conquérez des territoires avec vos amis et grimpez au classement mondial.",
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
