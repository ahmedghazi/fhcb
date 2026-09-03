const website = {
  pathPrefix: "/",
  title: "Fondation Henri Cartier-Bresson",
  titleAlt: "FHCB",
  description: "Fondation Henri Cartier-Bresson",
  headline: "",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fhcb-preprod.vercel.app",
  image:
    "https://cdn.sanity.io/images/e07ih8cz/production/51ccb6e4efe71b9f6061378a8f9d1e9527d32ed9-312x154.svg",
  ogLanguage: "fr_FR",

  faviconLetter: "F",
  favicon: "src/images/logo.png",
  shortName: "fhcb",
  author: "aeai",
  themeColor: "#ffffff",
  backgroundColor: "#ffffff",

  instagram: "",
  twitter: "",
  facebook: "",
  googleAnalyticsID: process.env.NEXT_PUBLIC_GA_ID || "G-52484966",

  skipNavId: "reach-skip-nav",
};

export default website;
