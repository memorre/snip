import type { Dictionary } from "../types";

// Français. Typographie : espace insécable ( ) avant « : » et à l’intérieur des guillemets,
// espace fine insécable ( ) avant ? ! ; — pas de point final dans les titres.

export const fr: Dictionary = {
  meta: {
    title: "Snip — Des liens courts avec de vraies statistiques",
    description:
      "Créez des liens courts et suivez chaque clic en temps réel : sources, appareils, navigateurs et localisation, pour chaque lien.",
    login: "Connexion",
    dashboard: "Tableau de bord",
    analytics: "Statistiques de /{slug}",
    notFound: "Lien introuvable",
  },

  common: {
    language: "Langue",
    themeToDark: "Passer en mode sombre",
    themeToLight: "Passer en mode clair",
    close: "Fermer",
    cancel: "Annuler",
    loading: "Chargement…",
    justNow: "à l’instant",
    optional: "Facultatif",
    notifications: "Notifications",
  },

  nav: {
    home: "Accueil de Snip",
    dashboard: "Tableau de bord",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    account: "Compte",
  },

  landing: {
    eyebrow: "Raccourcisseur de liens avec statistiques en direct",
    taglineLead: "Chaque clic,",
    taglineAccent: "suivi en direct",
    lead: "Snip transforme une longue URL en lien court, puis vous montre qui a cliqué, d’où et sur quel appareil, au moment même où cela se produit.",
    ctaPrimary: "Commencer",
    ctaDemo: "Essayer la démo",
    preview: {
      label: "Exemple de statistiques en direct pour un lien",
      live: "En direct",
      clicksToday: "Clics aujourd’hui",
      topReferrer: "Source principale",
      topCountry: "Pays principal",
      lastWeek: "7 derniers jours",
    },
    featuresTitle: "Tout ce qu’il faut à un lien court",
    featuresSubtitle: "Avec de vraies statistiques intégrées",
    features: {
      links: {
        title: "Des liens courts et nets",
        body: "Choisissez un alias facile à retenir ou laissez Snip en générer un. La redirection ne prend que quelques millisecondes.",
      },
      analytics: {
        title: "De vraies statistiques",
        body: "Tendance quotidienne, sources, appareils, navigateurs et systèmes d’exploitation pour chaque lien, bien plus qu’un simple compteur.",
      },
      live: {
        title: "Les clics en direct",
        body: "Gardez les statistiques d’un lien ouvertes et voyez les nouveaux clics arriver en temps réel, sans recharger la page.",
      },
      geo: {
        title: "Pays et villes",
        body: "Découvrez d’où viennent vos clics grâce à la géolocalisation en bordure de réseau, sans service supplémentaire.",
      },
      qr: {
        title: "Un QR code pour chaque lien",
        body: "Généré à la volée et prêt à télécharger en PNG pour vos présentations, affiches et documents imprimés.",
      },
      screens: {
        title: "À l’aise sur tous les écrans",
        body: "Le tableau de bord et les graphiques s’adaptent aux téléphones, tablettes et ordinateurs, en mode clair comme en mode sombre.",
      },
    },
    ctaTitle: "Envie de le voir en direct",
    ctaBody: "Connectez-vous avec le compte de démonstration. Il n’y a rien à configurer.",
    ctaButton: "Se connecter",
    footerNote: "Projet de portfolio, sans lien avec un quelconque service de raccourcissement d’URL.",
    footerMore: "Autres projets de Tao Ye",
  },

  login: {
    title: "Se connecter à Snip",
    subtitle: "Créez des liens courts et suivez chaque clic en temps réel.",
    email: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    submit: "Se connecter",
    submitting: "Connexion…",
    or: "ou",
    demo: "Essayer le compte démo",
    demoHint: "Compte de démonstration",
    back: "Retour à l’accueil",
    features: {
      instant: "Redirections instantanées et suivi des clics en direct",
      breakdowns: "Répartition par source, appareil et localisation",
      qr: "Un QR code téléchargeable pour chaque lien",
    },
    errors: {
      invalid: "E-mail ou mot de passe incorrect.",
      demo: "Impossible de se connecter au compte de démonstration. Veuillez réessayer.",
      generic: "Une erreur s’est produite. Veuillez réessayer.",
    },
  },

  dashboard: {
    welcome: "Bon retour",
    newLink: "Nouveau lien",
    summary: "Résumé",
    stats: {
      active: "Liens actifs",
      total: "Clics au total",
      week: "Clics cette semaine",
    },
    linksTitle: "Vos liens",
    disabled: "Désactivé",
    clicks: { one: "{count} clic", many: "{count} de clics", other: "{count} clics" },
    created: "Créé {time}",
    createdJustNow: "Créé à l’instant",
    analytics: "Stats",
    copy: "Copier le lien",
    copied: "Lien copié",
    toggle: "Lien activé",
    delete: "Supprimer le lien",
    deleted: "/{slug} a été supprimé",
    empty: {
      title: "Aucun lien pour l’instant",
      body: "Créez votre premier lien court pour commencer.",
    },
    confirmDelete: {
      title: "Supprimer /{slug} ?",
      body: {
        one: "Le lien cessera immédiatement de fonctionner et le clic enregistré sera supprimé avec lui. Cette action est irréversible.",
        many: "Le lien cessera immédiatement de fonctionner et ses {count} de clics enregistrés seront supprimés avec lui. Cette action est irréversible.",
        other:
          "Le lien cessera immédiatement de fonctionner et ses {count} clics enregistrés seront supprimés avec lui. Cette action est irréversible.",
      },
      bodyNoClicks: "Le lien cessera immédiatement de fonctionner. Cette action est irréversible.",
      confirm: "Supprimer",
    },
  },

  create: {
    title: "Créer un lien court",
    description: "Collez une URL. Snip génère un alias, ou choisissez le vôtre.",
    destination: "URL de destination",
    destinationPlaceholder: "https://exemple.com/un/long/chemin",
    slug: "Alias personnalisé",
    slugPlaceholder: "Généré automatiquement",
    label: "Libellé",
    labelPlaceholder: "p. ex. Lancement",
    submit: "Créer le lien",
    submitting: "Création…",
    created: "Lien court créé",
    ready: "Votre lien court est prêt",
    copy: "Copier le lien",
    copied: "Copié",
    done: "Terminé",
  },

  errors: {
    invalidUrl: "Saisissez une URL valide, avec https://",
    invalidInput: "Certaines informations ne sont pas valides.",
    slugFormat:
      "L’alias doit comporter de 3 à 32 caractères : lettres, chiffres, traits d’union et tirets bas uniquement.",
    slugReserved: "« {slug} » est réservé. Choisissez un autre alias.",
    slugTaken: "« {slug} » est déjà utilisé.",
    unauthorized: "Veuillez vous connecter pour continuer.",
    notFound: "Lien introuvable.",
  },

  analytics: {
    back: "Tableau de bord",
    copy: "Copier le lien",
    copied: "Lien copié",
    disabled: "Désactivé",
    summary: "Résumé",
    stats: {
      clicks: { one: "Clics sur le dernier jour", other: "Clics sur {count} jours" },
      average: "Moyenne par jour",
      created: "Créé",
    },
    chart: {
      title: "Évolution des clics",
      range: "Période",
      days: { one: "{count} jour", other: "{count} jours" },
      label: "Clics par jour",
    },
    clicks: { one: "{count} clic", many: "{count} de clics", other: "{count} clics" },
    devices: "Appareils",
    deviceNames: {
      desktop: "Ordinateur",
      mobile: "Mobile",
      tablet: "Tablette",
      otherDevice: "Autre",
    },
    referrers: "Principales sources",
    browsers: "Navigateurs",
    os: "Systèmes d’exploitation",
    countries: "Pays et régions",
    cities: "Villes",
    direct: "Accès direct",
    unknown: "Inconnu",
    noData: "Pas encore de données",
    noClicks: "Aucun clic pour l’instant",
    recent: "Clics récents",
    live: "En direct",
    liveToast: "Nouveau clic",
    liveToastBody: "Les graphiques sont à jour.",
    qr: {
      title: "QR code",
      hint: "Scannez-le pour ouvrir le lien court",
      alt: "QR code de {url}",
      download: "Télécharger en PNG",
    },
  },

  notFound: {
    title: "Ce lien n’existe pas",
    body: "Il a peut-être été désactivé ou a expiré, à moins qu’il n’ait jamais existé.",
    home: "Retour à Snip",
  },
};
