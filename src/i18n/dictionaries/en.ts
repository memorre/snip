// Source of truth for every user-visible string. Other locales are typed against this shape.
// Conventions: no trailing full stop in headings; {name} placeholders; plural messages are objects
// keyed by CLDR category and are picked with the `count` variable. Never use "other" as a namespace key.

export const en = {
  meta: {
    title: "Snip — Short links with real analytics",
    description:
      "Create short links and watch clicks land in real time, with referrers, devices, browsers and locations for every link.",
    login: "Sign in",
    dashboard: "Dashboard",
    analytics: "Analytics for /{slug}",
    notFound: "Link not found",
  },

  common: {
    language: "Language",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    close: "Close",
    cancel: "Cancel",
    loading: "Loading…",
    justNow: "just now",
    optional: "Optional",
    notifications: "Notifications",
  },

  nav: {
    home: "Snip home",
    dashboard: "Dashboard",
    signIn: "Sign in",
    signOut: "Sign out",
    account: "Account",
  },

  landing: {
    eyebrow: "Link shortener with live analytics",
    taglineLead: "Every click,",
    taglineAccent: "tracked live",
    lead: "Snip turns a long URL into a short one, then shows you who clicked it, from where and on what device, the moment it happens.",
    ctaPrimary: "Get started",
    ctaDemo: "Try the demo",
    preview: {
      label: "Example of a link’s live analytics",
      live: "Live",
      clicksToday: "Clicks today",
      topReferrer: "Top referrer",
      topCountry: "Top country",
      lastWeek: "Last 7 days",
    },
    featuresTitle: "Everything a short link needs",
    featuresSubtitle: "With real analytics built in",
    features: {
      links: {
        title: "Clean short links",
        body: "Pick a memorable slug or let Snip generate one. Redirects happen in milliseconds.",
      },
      analytics: {
        title: "Real analytics",
        body: "Daily trends, referrers, devices, browsers and operating systems for every link, not just a click count.",
      },
      live: {
        title: "Live click stream",
        body: "Keep a link’s analytics open and watch new clicks arrive as they happen, no refresh needed.",
      },
      geo: {
        title: "Countries and cities",
        body: "See where your clicks come from, powered by edge geolocation with no extra service.",
      },
      qr: {
        title: "A QR code for every link",
        body: "Generated on the spot and ready to download as a PNG for slides, posters and print.",
      },
      screens: {
        title: "At home on any screen",
        body: "The dashboard and charts adapt to phones, tablets and desktops, in light and dark mode.",
      },
    },
    ctaTitle: "Ready to see it live",
    ctaBody: "Sign in with the demo account. There’s nothing to set up.",
    ctaButton: "Sign in",
    footerNote: "A portfolio project. Not affiliated with any URL-shortening service.",
    footerMore: "More projects by Tao Ye",
  },

  login: {
    title: "Sign in to Snip",
    subtitle: "Create short links and watch every click land in real time.",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    or: "or",
    demo: "Try the demo account",
    demoHint: "Demo account",
    back: "Back to home",
    features: {
      instant: "Instant redirects with live click tracking",
      breakdowns: "Referrer, device and location breakdowns",
      qr: "A downloadable QR code for every link",
    },
    errors: {
      invalid: "Incorrect email or password.",
      demo: "Couldn’t sign in to the demo account. Please try again.",
      generic: "Something went wrong. Please try again.",
    },
  },

  dashboard: {
    welcome: "Welcome back",
    newLink: "New link",
    summary: "Summary",
    stats: {
      active: "Active links",
      total: "Total clicks",
      week: "Clicks this week",
    },
    linksTitle: "Your links",
    disabled: "Disabled",
    clicks: { one: "{count} click", other: "{count} clicks" },
    created: "Created {time}",
    createdJustNow: "Created just now",
    analytics: "Stats",
    copy: "Copy link",
    copied: "Link copied",
    toggle: "Link enabled",
    delete: "Delete link",
    deleted: "Deleted /{slug}",
    empty: {
      title: "No links yet",
      body: "Create your first short link to get started.",
    },
    confirmDelete: {
      title: "Delete /{slug}?",
      body: {
        one: "The link stops working right away, and its {count} recorded click is deleted with it. This can’t be undone.",
        other:
          "The link stops working right away, and its {count} recorded clicks are deleted with it. This can’t be undone.",
      },
      bodyNoClicks: "The link stops working right away. This can’t be undone.",
      confirm: "Delete",
    },
  },

  create: {
    title: "Create a short link",
    description: "Paste a URL. Snip generates a slug, or you can choose your own.",
    destination: "Destination URL",
    destinationPlaceholder: "https://example.com/a/long/path",
    slug: "Custom slug",
    slugPlaceholder: "Auto-generated",
    label: "Label",
    labelPlaceholder: "e.g. Launch post",
    submit: "Create link",
    submitting: "Creating…",
    created: "Short link created",
    ready: "Your short link is ready",
    copy: "Copy link",
    copied: "Copied",
    done: "Done",
  },

  errors: {
    invalidUrl: "Enter a valid URL, including https://",
    invalidInput: "Some of the details aren’t valid.",
    slugFormat: "Slugs need 3–32 characters: letters, numbers, hyphens and underscores only.",
    slugReserved: "“{slug}” is reserved. Please choose another slug.",
    slugTaken: "“{slug}” is already taken.",
    unauthorized: "Please sign in to continue.",
    notFound: "Link not found.",
  },

  analytics: {
    back: "Dashboard",
    copy: "Copy link",
    copied: "Link copied",
    disabled: "Disabled",
    summary: "Summary",
    stats: {
      clicks: { one: "Clicks in the last day", other: "Clicks in the last {count} days" },
      average: "Average per day",
      created: "Created",
    },
    chart: {
      title: "Clicks over time",
      range: "Date range",
      days: { one: "{count} day", other: "{count} days" },
      label: "Daily clicks",
    },
    clicks: { one: "{count} click", other: "{count} clicks" },
    devices: "Devices",
    deviceNames: {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tablet",
      otherDevice: "Other",
    },
    referrers: "Top referrers",
    browsers: "Browsers",
    os: "Operating systems",
    countries: "Countries and regions",
    cities: "Cities",
    direct: "Direct",
    unknown: "Unknown",
    noData: "No data yet",
    noClicks: "No clicks yet",
    recent: "Recent clicks",
    live: "Live",
    liveToast: "New click just landed",
    liveToastBody: "The charts are up to date.",
    qr: {
      title: "QR code",
      hint: "Scan to open the short link",
      alt: "QR code for {url}",
      download: "Download PNG",
    },
  },

  notFound: {
    title: "This link doesn’t exist",
    body: "It may have been disabled or expired, or it never existed in the first place.",
    home: "Back to Snip",
  },
};
