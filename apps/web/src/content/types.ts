export interface Dictionary {
  locale: 'uz' | 'en';
  brand: {
    name: string;
    tagline: string;
    subtagline: string;
  };
  a11y: {
    skipLink: string;
    mainNavigation: string;
    languageSelector: string;
    userProfile: string;
    reducedDecorToggle: string;
  };
  nav: {
    library: string;
    daily: string;
    archive: string;
    settings: string;
    signIn: string;
  };
  stamps: {
    header: string;
    new: string;
    read: string;
    done: string;
    archived: string;
  };
  collections: {
    all: string;
    jobs: string;
    freelance: string;
    courses: string;
    housing: string;
    tools: string;
    newCollectionDisabled: string;
  };
  landing: {
    eyebrow: string;
    h1Part1: string;
    h1Accent: string;
    subtitle: string;
    primaryCta: string;
    secondaryLink: string;
    stepsTitle: string;
    steps: {
      find: { title: string; desc: string };
      keep: { title: string; desc: string };
      act: { title: string; desc: string };
    };
    quote: string;
    microClaims: string;
    finalCtaTitle: string;
    finalCtaSubtitle: string;
    telegramBot: string;
    chromeExtension: string;
  };
  common: {
    save: string;
    cancel: string;
    comingSoon: string;
    searchPlaceholder: string;
    searchShortcutHint: string;
    page: string;
    of: string;
    total: string;
  };
  footer: {
    description: string;
    specsLink: string;
    decorToggleActive: string;
    decorToggleDefault: string;
    rights: string;
  };
}
