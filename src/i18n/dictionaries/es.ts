import type { Dictionary } from "../types";

// Español neutro (latinoamericano / internacional), tuteo. Sin punto final en los títulos.

export const es: Dictionary = {
  meta: {
    title: "Snip — Enlaces cortos con analíticas reales",
    description:
      "Crea enlaces cortos y ve llegar cada clic en tiempo real, con el origen, el dispositivo, el navegador y la ubicación de cada enlace.",
    login: "Iniciar sesión",
    dashboard: "Panel",
    analytics: "Analíticas de /{slug}",
    notFound: "Enlace no encontrado",
  },

  common: {
    language: "Idioma",
    themeToDark: "Cambiar a modo oscuro",
    themeToLight: "Cambiar a modo claro",
    close: "Cerrar",
    cancel: "Cancelar",
    loading: "Cargando…",
    justNow: "hace un momento",
    optional: "Opcional",
  },

  nav: {
    home: "Inicio de Snip",
    dashboard: "Panel",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    account: "Cuenta",
  },

  landing: {
    eyebrow: "Acortador de enlaces con analíticas en vivo",
    taglineLead: "Cada clic,",
    taglineAccent: "en tiempo real",
    lead: "Snip convierte una URL larga en un enlace corto y te muestra quién hizo clic, desde dónde y con qué dispositivo, en el momento en que ocurre.",
    ctaPrimary: "Comenzar",
    ctaDemo: "Probar la demo",
    preview: {
      label: "Ejemplo de analíticas en vivo de un enlace",
      live: "En vivo",
      clicksToday: "Clics de hoy",
      topReferrer: "Origen principal",
      topCountry: "País principal",
      lastWeek: "Últimos 7 días",
    },
    featuresTitle: "Todo lo que necesita un enlace corto",
    featuresSubtitle: "Con analíticas reales integradas",
    features: {
      links: {
        title: "Enlaces cortos y limpios",
        body: "Elige un alias fácil de recordar o deja que Snip genere uno. La redirección tarda apenas milisegundos.",
      },
      analytics: {
        title: "Analíticas de verdad",
        body: "Tendencia diaria, orígenes, dispositivos, navegadores y sistemas operativos de cada enlace, no solo un contador de clics.",
      },
      live: {
        title: "Clics en vivo",
        body: "Deja abiertas las analíticas de un enlace y verás llegar cada clic al instante, sin recargar la página.",
      },
      geo: {
        title: "Países y ciudades",
        body: "Descubre de dónde vienen tus clics con geolocalización en el borde de la red, sin servicios adicionales.",
      },
      qr: {
        title: "Un código QR para cada enlace",
        body: "Se genera al instante y puedes descargarlo en PNG para presentaciones, carteles e impresos.",
      },
      screens: {
        title: "Cómodo en cualquier pantalla",
        body: "El panel y los gráficos se adaptan a teléfonos, tabletas y computadoras, en modo claro y oscuro.",
      },
    },
    ctaTitle: "Míralo en vivo",
    ctaBody: "Inicia sesión con la cuenta de demostración. No hay nada que configurar.",
    ctaButton: "Iniciar sesión",
    footerNote: "Proyecto de portafolio. Sin relación con ningún servicio de acortamiento de URL.",
    footerMore: "Más proyectos de Tao Ye",
  },

  login: {
    title: "Inicia sesión en Snip",
    subtitle: "Crea enlaces cortos y ve llegar cada clic en tiempo real.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    submit: "Iniciar sesión",
    submitting: "Iniciando sesión…",
    or: "o",
    demo: "Probar la cuenta demo",
    demoHint: "Cuenta de demostración",
    back: "Volver al inicio",
    features: {
      instant: "Redirecciones instantáneas con seguimiento de clics en vivo",
      breakdowns: "Desglose por origen, dispositivo y ubicación",
      qr: "Un código QR descargable para cada enlace",
    },
    errors: {
      invalid: "El correo electrónico o la contraseña no son correctos.",
      demo: "No se pudo iniciar sesión con la cuenta de demostración. Inténtalo de nuevo.",
      generic: "Algo salió mal. Inténtalo de nuevo.",
    },
  },

  dashboard: {
    welcome: "Hola de nuevo",
    newLink: "Nuevo enlace",
    summary: "Resumen",
    stats: {
      active: "Enlaces activos",
      total: "Clics totales",
      week: "Clics esta semana",
    },
    linksTitle: "Tus enlaces",
    disabled: "Desactivado",
    clicks: { one: "{count} clic", many: "{count} de clics", other: "{count} clics" },
    created: "Creado {time}",
    createdJustNow: "Creado hace un momento",
    analytics: "Estadísticas",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    toggle: "Enlace activado",
    delete: "Eliminar enlace",
    deleted: "Se eliminó /{slug}",
    empty: {
      title: "Aún no hay enlaces",
      body: "Crea tu primer enlace corto para empezar.",
    },
    confirmDelete: {
      title: "¿Eliminar /{slug}?",
      body: {
        one: "El enlace dejará de funcionar de inmediato y también se eliminará su {count} clic registrado. Esta acción no se puede deshacer.",
        many: "El enlace dejará de funcionar de inmediato y también se eliminarán sus {count} de clics registrados. Esta acción no se puede deshacer.",
        other:
          "El enlace dejará de funcionar de inmediato y también se eliminarán sus {count} clics registrados. Esta acción no se puede deshacer.",
      },
      confirm: "Eliminar",
    },
  },

  create: {
    title: "Crear un enlace corto",
    description: "Pega una URL. Snip genera un alias, o puedes elegir el tuyo.",
    destination: "URL de destino",
    destinationPlaceholder: "https://ejemplo.com/una/ruta/larga",
    slug: "Alias personalizado",
    slugPlaceholder: "Generado automáticamente",
    label: "Etiqueta",
    labelPlaceholder: "p. ej. Lanzamiento",
    submit: "Crear enlace",
    submitting: "Creando…",
    created: "Enlace corto creado",
    ready: "Tu enlace corto está listo",
    copy: "Copiar enlace",
    copied: "Copiado",
    done: "Listo",
  },

  errors: {
    invalidUrl: "Escribe una URL válida, con https://",
    invalidInput: "Algunos datos no son válidos.",
    slugFormat: "El alias debe tener entre 3 y 32 caracteres: solo letras, números, guiones y guiones bajos.",
    slugReserved: "“{slug}” está reservado. Elige otro alias.",
    slugTaken: "“{slug}” ya está en uso.",
    unauthorized: "Inicia sesión para continuar.",
    notFound: "No se encontró el enlace.",
  },

  analytics: {
    back: "Panel",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    disabled: "Desactivado",
    summary: "Resumen",
    stats: {
      clicks: { one: "Clics del último día", other: "Clics de los últimos {count} días" },
      average: "Promedio diario",
      created: "Creado",
    },
    chart: {
      title: "Evolución de los clics",
      range: "Periodo",
      days: { one: "{count} día", other: "{count} días" },
      label: "Clics por día",
    },
    clicks: { one: "{count} clic", many: "{count} de clics", other: "{count} clics" },
    devices: "Dispositivos",
    deviceNames: {
      desktop: "Escritorio",
      mobile: "Móvil",
      tablet: "Tableta",
      otherDevice: "Otro",
    },
    referrers: "Principales orígenes",
    browsers: "Navegadores",
    os: "Sistemas operativos",
    countries: "Países y regiones",
    cities: "Ciudades",
    direct: "Directo",
    unknown: "Desconocido",
    noData: "Aún no hay datos",
    noClicks: "Aún no hay clics",
    recent: "Clics recientes",
    live: "En vivo",
    liveToast: "Llegó un clic nuevo",
    liveToastBody: "Los gráficos están actualizados.",
    qr: {
      title: "Código QR",
      hint: "Escanéalo para abrir el enlace corto",
      alt: "Código QR de {url}",
      download: "Descargar PNG",
    },
  },

  notFound: {
    title: "Este enlace no existe",
    body: "Puede que se haya desactivado o haya caducado, o que nunca haya existido.",
    home: "Volver a Snip",
  },
};
