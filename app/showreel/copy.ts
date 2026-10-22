// Headlines use *stars* around the words drawn in lime.

export type Lang = "fr" | "en";

export const COPY = {
  fr: {
    eyebrow: "SAPIENS RANK",
    intro: "Et si ta santé\nétait *un jeu ?*",
    move: "Bouge dans\nla *vraie vie.*",
    steps: "pas",
    score: "Tes efforts\ndeviennent\ndes *Sapies.*",
    scoreEyebrow: "SAPIENS SCORE",
    harvest: "Récolte",
    map: "Conquiers\nle monde avec\n*ta guilde.*",
    podium: "Grimpe au\nclassement\n*mondial.*",
    phones: "Avance dans le jeu\n*avec tes amis.*",
    tagline: "Bouge dans la vraie vie,\n*avance dans le jeu avec tes amis.*",
    free: "Gratuit sur iOS et Android",
  },
  en: {
    eyebrow: "SAPIENS RANK",
    intro: "What if your health\nwas *a game?*",
    move: "Move in\n*real life.*",
    steps: "steps",
    score: "Your effort\nturns into\n*Sapies.*",
    scoreEyebrow: "SAPIENS SCORE",
    harvest: "Harvest",
    map: "Conquer\nthe world with\n*your guild.*",
    podium: "Climb the\nworld\n*leaderboard.*",
    phones: "Level up in the game\n*with your friends.*",
    tagline: "Move in real life,\n*level up in the game with your friends.*",
    free: "Free on iOS and Android",
  },
} satisfies Record<Lang, Record<string, string>>;

export type Copy = (typeof COPY)[Lang];

export const PODIUM = [
  { name: "Léa", initials: "LM", score: 912, color: "#D9FF3D" },
  { name: "Malik", initials: "MK", score: 874, color: "#7CB6FF" },
  { name: "Tom", initials: "TB", score: 851, color: "#F0A64A" },
];
