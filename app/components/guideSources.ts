import type { Locale } from "../i18n";
import type { GuideLabels, OS, Source } from "./guideTypes";

type L<T> = Record<Locale, T>;

type LocalizedShot = { src: string; step: number; alt: L<string> };

type LocalizedSource = Omit<Source, "name" | "steps" | "shots"> & {
  name: string | L<string>;
  steps: Partial<Record<OS, L<string[]>>>;
  shots?: Partial<Record<OS, LocalizedShot[]>>;
};

const SOURCES: LocalizedSource[] = [
  {
    id: "garmin",
    name: "Garmin Connect",
    logo: { src: "/logos/garmin.webp", width: 209, height: 72, invert: true },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "yes",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: {
        fr: [
          "Dans Garmin Connect, ouvrez l'onglet Plus (en bas à droite).",
          "Touchez Paramètres.",
          "Touchez Applications connectées.",
          "Choisissez Apple Health.",
          "Touchez Se connecter avec Apple Health, puis choisissez les données à partager dans l'écran Apple Health qui s'affiche.",
        ],
        en: [
          "In Garmin Connect, open the More tab (bottom right).",
          "Tap Settings.",
          "Tap Connected Apps.",
          "Choose Apple Health.",
          "Tap Connect with Apple Health, then choose the data to share on the Apple Health screen that appears.",
        ],
      },
      android: {
        fr: [
          "Cette connexion demande Android 14 ou plus.",
          "Dans Garmin Connect, touchez Plus (en bas à droite).",
          "Touchez Paramètres, puis Applications connectées.",
          "Choisissez Health Connect.",
          "Touchez Mise en route.",
          "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
        ],
        en: [
          "This connection requires Android 14 or later.",
          "In Garmin Connect, tap More (bottom right).",
          "Tap Settings, then Connected Apps.",
          "Choose Health Connect.",
          "Tap Get Started.",
          "On the permission screen, turn on Allow all, then tap Allow.",
        ],
      },
    },
    shots: {
      android: [
        {
          src: "/guide/garmin-android-1.webp",
          alt: {
            fr: "Accueil de Garmin Connect sur Android, l'onglet Plus encadré en bas à droite.",
            en: "Garmin Connect home screen on Android, with the More tab highlighted bottom right.",
          },
          step: 2,
        },
        {
          src: "/guide/garmin-android-2.webp",
          alt: {
            fr: "Menu Plus de Garmin Connect, la ligne Paramètres encadrée.",
            en: "Garmin Connect More menu, with the Settings row highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/garmin-android-3.webp",
          alt: {
            fr: "Écran Paramètres de Garmin Connect, la ligne Applications connectées encadrée.",
            en: "Garmin Connect Settings screen, with the Connected Apps row highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/garmin-android-4.webp",
          alt: {
            fr: "Écran Applications connectées de Garmin Connect, la ligne Health Connect encadrée.",
            en: "Garmin Connect Connected Apps screen, with the Health Connect row highlighted.",
          },
          step: 4,
        },
        {
          src: "/guide/garmin-android-5.webp",
          alt: {
            fr: "Écran Synchroniser avec Health Connect, le bouton Mise en route encadré.",
            en: "Sync with Health Connect screen, with the Get Started button highlighted.",
          },
          step: 5,
        },
        {
          src: "/guide/garmin-android-6.webp",
          alt: {
            fr: "Dialogue Android autorisant Garmin Connect à écrire dans Santé Connect, l'option Tout autoriser encadrée.",
            en: "Android dialog allowing Garmin Connect to write to Health Connect, with the Allow all option highlighted.",
          },
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/garmin-ios-1.webp",
          alt: {
            fr: "Menu Plus de Garmin Connect, la ligne Paramètres encadrée.",
            en: "Garmin Connect More menu, with the Settings row highlighted.",
          },
          step: 2,
        },
        {
          src: "/guide/garmin-ios-2.webp",
          alt: {
            fr: "Écran Paramètres de Garmin Connect, la ligne Applications connectées encadrée.",
            en: "Garmin Connect Settings screen, with the Connected Apps row highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/garmin-ios-3.webp",
          alt: {
            fr: "Écran Applications connectées de Garmin Connect, la ligne Apple Health encadrée.",
            en: "Garmin Connect Connected Apps screen, with the Apple Health row highlighted.",
          },
          step: 4,
        },
        {
          src: "/guide/garmin-ios-4.webp",
          alt: {
            fr: "Écran Apple Health de Garmin Connect, le bouton Se connecter avec Apple Health encadré.",
            en: "Garmin Connect Apple Health screen, with the Connect with Apple Health button highlighted.",
          },
          step: 5,
        },
      ],
    },
  },
  {
    id: "fitbit",
    name: "Google Health (Fitbit)",
    logo: { src: "/logos/google-health.webp", width: 82, height: 72 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "yes",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: {
        fr: [
          "Mettez à jour l'app Google Health sur l'App Store (iOS 16.4 minimum).",
          "Ouvrez l'app et touchez l'icône Connexions, en haut à gauche.",
          "Ouvrez l'onglet Applis et services.",
          "Sous « Ajouter des connexions », touchez Apple Santé.",
          "Sur l'écran Accès à Santé, touchez Tout activer, puis Autoriser.",
        ],
        en: [
          "Update the Google Health app from the App Store (iOS 16.4 or later).",
          "Open the app and tap the Connections icon, top left.",
          "Open the Apps & services tab.",
          "Under “Add connections”, tap Apple Health.",
          "On the Health Access screen, tap Turn On All, then Allow.",
        ],
      },
      android: {
        fr: [
          "Ouvrez l'app Google Health (Android 9 ou plus) et touchez l'icône Connexions, en haut à gauche.",
          "Sous Applis et services, touchez Applis partenaires.",
          "Sous Paramètres, touchez Gérer Santé Connect.",
          "Sur la carte « Profitez davantage de Santé Connect », touchez Consulter.",
          "Activez Tout autoriser, puis touchez Autoriser : la lecture et l'écriture sont toutes deux nécessaires.",
        ],
        en: [
          "Open the Google Health app (Android 9 or later) and tap the Connections icon, top left.",
          "Under Apps & services, tap Partner apps.",
          "Under Settings, tap Manage Health Connect.",
          "On the “Get more out of Health Connect” card, tap Review.",
          "Turn on Allow all, then tap Allow: both read and write access are required.",
        ],
      },
    },
    shots: {
      ios: [
        {
          src: "/guide/fitbit-ios-1.webp",
          alt: {
            fr: "Accueil de Google Health sur iPhone, l'icône Connexions encadrée en haut à gauche.",
            en: "Google Health home screen on iPhone, with the Connections icon highlighted top left.",
          },
          step: 2,
        },
        {
          src: "/guide/fitbit-ios-2.webp",
          alt: {
            fr: "Écran Connexions de Google Health, l'onglet Applis et services encadré.",
            en: "Google Health Connections screen, with the Apps & services tab highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/fitbit-ios-3.webp",
          alt: {
            fr: "Onglet Applis et services de Google Health, l'entrée Apple Santé encadrée.",
            en: "Google Health Apps & services tab, with the Apple Health entry highlighted.",
          },
          step: 4,
        },
        {
          src: "/guide/fitbit-ios-4.webp",
          alt: {
            fr: "Écran iOS Accès à Santé demandant à Google Health d'écrire vos données, l'option Tout activer encadrée.",
            en: "iOS Health Access screen asking to let Google Health write your data, with the Turn On All option highlighted.",
          },
          step: 5,
        },
      ],
      android: [
        {
          src: "/guide/fitbit-android-1.webp",
          alt: {
            fr: "Accueil de Google Health sur Android, l'icône Connexions encadrée en haut à gauche.",
            en: "Google Health home screen on Android, with the Connections icon highlighted top left.",
          },
          step: 1,
        },
        {
          src: "/guide/fitbit-android-2.webp",
          alt: {
            fr: "Écran Connexions de Google Health, l'entrée Applis partenaires encadrée.",
            en: "Google Health Connections screen, with the Partner apps entry highlighted.",
          },
          step: 2,
        },
        {
          src: "/guide/fitbit-android-3.webp",
          alt: {
            fr: "Écran Applis partenaires, l'entrée Gérer Santé Connect encadrée sous Paramètres.",
            en: "Partner apps screen, with the Manage Health Connect entry highlighted under Settings.",
          },
          step: 3,
        },
        {
          src: "/guide/fitbit-android-4.webp",
          alt: {
            fr: "Écran Santé Connect de Google Health, le bouton Consulter encadré.",
            en: "Google Health's Health Connect screen, with the Review button highlighted.",
          },
          step: 4,
        },
        {
          src: "/guide/fitbit-android-5.webp",
          alt: {
            fr: "Dialogue Android autorisant Health à accéder à Santé Connect, l'option Tout autoriser encadrée.",
            en: "Android dialog allowing Health to access Health Connect, with the Allow all option highlighted.",
          },
          step: 5,
        },
      ],
    },
  },
  {
    id: "strava",
    name: "Strava",
    logo: { src: "/logos/strava.svg", width: 42, height: 59 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "no",
      calories: "no",
      sommeil: "no",
      cardio: "no",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: {
        fr: [
          "Dans Strava, ouvrez l'onglet Vous puis l'icône Paramètres (roue dentée, en haut à droite).",
          "Touchez Gérer les applications et les appareils.",
          "Sous Services, sélectionnez Santé.",
          "Activez Santé et Autoriser le partage de l'entraînement, puis, sous Paramètres d'automatisation, activez Envoyer à Apple Santé.",
        ],
        en: [
          "In Strava, open the You tab, then the Settings icon (gear, top right).",
          "Tap Manage Apps and Devices.",
          "Under Services, select Health.",
          "Turn on Health and workout sharing, then, under the automation settings, turn on sending to Apple Health.",
        ],
      },
      android: {
        fr: [
          "Sur Android 13 ou moins, installez d'abord Health Connect depuis le Play Store. Sur Android 14 et plus, il est intégré aux Paramètres.",
          "Dans Strava, ouvrez l'onglet Vous puis l'icône Paramètres (roue dentée, en haut à droite).",
          "Touchez Gérer les applications et les appareils.",
          "Sous Services, cochez Health Connect.",
          "Touchez Connecter.",
          "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
        ],
        en: [
          "On Android 13 or earlier, first install Health Connect from the Play Store. On Android 14 and later, it is built into Settings.",
          "In Strava, open the You tab, then the Settings icon (gear, top right).",
          "Tap Manage Apps and Devices.",
          "Under Services, check Health Connect.",
          "Tap Connect.",
          "On the permission screen, turn on Allow all, then tap Allow.",
        ],
      },
    },
    shots: {
      android: [
        {
          src: "/guide/strava-android-1.webp",
          alt: {
            fr: "Onglet Vous de Strava sur Android, l'icône Paramètres en haut à droite.",
            en: "Strava You tab on Android, with the Settings icon top right.",
          },
          step: 2,
        },
        {
          src: "/guide/strava-android-2.webp",
          alt: {
            fr: "Écran Paramètres de Strava, la ligne Gérer les applications et les appareils encadrée.",
            en: "Strava Settings screen, with the Manage Apps and Devices row highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/strava-android-3.webp",
          alt: {
            fr: "Écran Autres services de Strava, la case Health Connect encadrée sous Services.",
            en: "Strava Other services screen, with the Health Connect checkbox highlighted under Services.",
          },
          step: 4,
        },
        {
          src: "/guide/strava-android-4.webp",
          alt: {
            fr: "Écran invitant à connecter Strava à Health Connect, le bouton Connecter encadré.",
            en: "Screen inviting you to connect Strava to Health Connect, with the Connect button highlighted.",
          },
          step: 5,
        },
        {
          src: "/guide/strava-android-5.webp",
          alt: {
            fr: "Dialogue Android autorisant Strava à accéder à Santé Connect, l'option Tout autoriser encadrée.",
            en: "Android dialog allowing Strava to access Health Connect, with the Allow all option highlighted.",
          },
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/strava-ios-1.webp",
          alt: {
            fr: "Onglet Vous de Strava, l'icône Paramètres encadrée en haut à droite.",
            en: "Strava You tab, with the Settings icon highlighted top right.",
          },
          step: 1,
        },
        {
          src: "/guide/strava-ios-2.webp",
          alt: {
            fr: "Écran Paramètres de Strava, la ligne Gérer les applications et les appareils encadrée.",
            en: "Strava Settings screen, with the Manage Apps and Devices row highlighted.",
          },
          step: 2,
        },
        {
          src: "/guide/strava-ios-3.webp",
          alt: {
            fr: "Écran de gestion des appareils Strava, le service Santé encadré.",
            en: "Strava device management screen, with the Health service highlighted.",
          },
          step: 3,
        },
        {
          src: "/guide/strava-ios-4.webp",
          alt: {
            fr: "Écran Paramètres Apple Santé de Strava, les autorisations et l'option Envoyer à Apple Santé encadrées.",
            en: "Strava Apple Health settings screen, with the permissions and the send-to-Apple-Health option highlighted.",
          },
          step: 4,
        },
      ],
    },
  },
  {
    id: "coros",
    name: "COROS",
    logo: { src: "/logos/coros.png", width: 82, height: 72 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "no",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "no",
    },
    steps: {
      ios: {
        fr: [
          "Ouvrez l'app COROS, touchez l'onglet Profil (en bas à droite), puis Paramètres.",
          "Touchez Applications tierces.",
          "Touchez Synchro. des données.",
          "Dans la liste, sélectionnez Apple Santé et autorisez le partage. Une pastille verte confirme la connexion.",
        ],
        en: [
          "Open the COROS app, tap the Profile tab (bottom right), then Settings.",
          "Tap Third-Party Apps.",
          "Tap Data Sync.",
          "In the list, select Apple Health and allow sharing. A green dot confirms the connection.",
        ],
      },
      android: {
        fr: [
          "Ouvrez l'app COROS, touchez l'onglet Profil (en bas à droite), puis Paramètres.",
          "Touchez Applications tierces.",
          "Touchez Synchro. des données.",
          "Dans la liste, choisissez Health Connect.",
          "Touchez Synchroniser.",
          "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
        ],
        en: [
          "Open the COROS app, tap the Profile tab (bottom right), then Settings.",
          "Tap Third-Party Apps.",
          "Tap Data Sync.",
          "In the list, choose Health Connect.",
          "Tap Sync.",
          "On the permission screen, turn on Allow all, then tap Allow.",
        ],
      },
    },
    shots: {
      android: [
        {
          src: "/guide/coros-android-1.webp",
          alt: {
            fr: "Onglet Profil de l'app COROS sur Android, avec l'entrée Paramètres en bas.",
            en: "COROS app Profile tab on Android, with the Settings entry at the bottom.",
          },
          step: 1,
        },
        {
          src: "/guide/coros-android-2.webp",
          alt: {
            fr: "Écran Paramètres de COROS, avec l'entrée Applications tierces.",
            en: "COROS Settings screen, with the Third-Party Apps entry.",
          },
          step: 2,
        },
        {
          src: "/guide/coros-android-3.webp",
          alt: {
            fr: "Écran Applications tierces de COROS, avec l'entrée Synchro. des données.",
            en: "COROS Third-Party Apps screen, with the Data Sync entry.",
          },
          step: 3,
        },
        {
          src: "/guide/coros-android-4.webp",
          alt: {
            fr: "Liste des applications tierces de COROS, avec l'entrée Health Connect.",
            en: "COROS third-party app list, with the Health Connect entry.",
          },
          step: 4,
        },
        {
          src: "/guide/coros-android-5.webp",
          alt: {
            fr: "Écran Health Connect de COROS, avec le bouton Synchroniser.",
            en: "COROS Health Connect screen, with the Sync button.",
          },
          step: 5,
        },
        {
          src: "/guide/coros-android-6.webp",
          alt: {
            fr: "Dialogue Android autorisant COROS à accéder à Santé Connect, avec l'option Tout autoriser.",
            en: "Android dialog allowing COROS to access Health Connect, with the Allow all option.",
          },
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/coros-ios-1.webp",
          alt: {
            fr: "Onglet Profil de l'app COROS, avec l'entrée Paramètres en bas de la page.",
            en: "COROS app Profile tab, with the Settings entry at the bottom of the page.",
          },
          step: 1,
        },
        {
          src: "/guide/coros-ios-2.webp",
          alt: {
            fr: "Écran Paramètres de COROS, avec l'entrée Applications tierces.",
            en: "COROS Settings screen, with the Third-Party Apps entry.",
          },
          step: 2,
        },
        {
          src: "/guide/coros-ios-3.webp",
          alt: {
            fr: "Écran Applications tierces de COROS, avec l'entrée Synchro. des données.",
            en: "COROS Third-Party Apps screen, with the Data Sync entry.",
          },
          step: 3,
        },
        {
          src: "/guide/coros-ios-4.webp",
          alt: {
            fr: "Liste des applications tierces de COROS, Apple Santé coché en vert.",
            en: "COROS third-party app list, with Apple Health checked in green.",
          },
          step: 4,
        },
      ],
    },
  },
  {
    id: "autre",
    name: { fr: "Autre appareil", en: "Other device" },
    platforms: ["ios", "android"],
    coverage: null,
    steps: {
      ios: {
        fr: [
          "Ouvrez les réglages de l'application fournie avec votre appareil.",
          "Cherchez une section Intégrations, Applications connectées ou Applications et services.",
          "Choisissez Apple Santé et autorisez l'écriture de toutes les catégories proposées.",
          "Si Apple Santé n'apparaît nulle part, l'application ne peut pas alimenter Sapiens Rank : écrivez-nous, on regarde ensemble.",
        ],
        en: [
          "Open the settings of the app that came with your device.",
          "Look for a section called Integrations, Connected Apps or Apps & Services.",
          "Choose Apple Health and allow writing for every category offered.",
          "If Apple Health appears nowhere, the app cannot feed Sapiens Rank: write to us and we’ll look into it together.",
        ],
      },
      android: {
        fr: [
          "Installez Health Connect depuis le Play Store s'il n'est pas déjà là.",
          "Dans les réglages de l'application de votre appareil, cherchez Health Connect.",
          "Autorisez l'écriture des pas, du sommeil, de la fréquence cardiaque et de l'exercice.",
          "Si Health Connect n'apparaît nulle part, l'application ne peut pas alimenter Sapiens Rank : écrivez-nous, on regarde ensemble.",
        ],
        en: [
          "Install Health Connect from the Play Store if it isn’t there already.",
          "In your device app’s settings, look for Health Connect.",
          "Allow writing steps, sleep, heart rate and exercise.",
          "If Health Connect appears nowhere, the app cannot feed Sapiens Rank: write to us and we’ll look into it together.",
        ],
      },
    },
  },
];

/** The sources with their text in one language, ready to hand to the client. */
export function getSources(locale: Locale): Source[] {
  return SOURCES.map((s) => ({
    ...s,
    name: typeof s.name === "string" ? s.name : s.name[locale],
    steps: Object.fromEntries(
      Object.entries(s.steps).map(([os, steps]) => [os, steps[locale]]),
    ),
    shots: s.shots
      ? Object.fromEntries(
          Object.entries(s.shots).map(([os, shots]) => [
            os,
            shots.map((shot) => ({ ...shot, alt: shot.alt[locale] })),
          ]),
        )
      : undefined,
  }));
}

const LABELS: L<GuideLabels> = {
  fr: {
    metrics: {
      pas: "Pas",
      calories: "Calories",
      sommeil: "Sommeil",
      cardio: "Cardio",
      vfc: "VFC",
      exercices: "Exercices",
    },
    hub: { ios: "Apple Santé", android: "Health Connect" },
    levels: { yes: "Transmis", partial: "Partiellement transmis" },
    phone: "Votre téléphone",
    choosePhone: "Choisir votre téléphone",
    autoDetected: "détecté automatiquement",
    app: "Votre application ou votre montre",
    empty: "Choisissez votre application pour afficher les étapes.",
    connect: ["Connecter ", " sur ", ""],
    provides: "Ce que cette source apporte à votre score :",
  },
  en: {
    metrics: {
      pas: "Steps",
      calories: "Calories",
      sommeil: "Sleep",
      cardio: "Heart rate",
      vfc: "HRV",
      exercices: "Workouts",
    },
    hub: { ios: "Apple Health", android: "Health Connect" },
    levels: { yes: "Sent", partial: "Partly sent" },
    phone: "Your phone",
    choosePhone: "Choose your phone",
    autoDetected: "detected automatically",
    app: "Your app or watch",
    empty: "Choose your app to see the steps.",
    connect: ["Connect ", " on ", ""],
    provides: "What this source adds to your score:",
  },
};

export function getGuideLabels(locale: Locale): GuideLabels {
  return LABELS[locale];
}
