import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge"];
const OS = ["macOS", "Windows", "iOS", "Android", "Linux"];
const DEVICE_BY_OS: Record<string, "DESKTOP" | "MOBILE" | "TABLET"> = {
  macOS: "DESKTOP",
  Windows: "DESKTOP",
  Linux: "DESKTOP",
  iOS: "MOBILE",
  Android: "MOBILE",
};
const REFERRERS = [
  null,
  null,
  null,
  "https://twitter.com/",
  "https://github.com/",
  "https://news.ycombinator.com/",
  "https://www.google.com/",
  "https://www.linkedin.com/",
];
const GEO = [
  { country: "US", city: "New York" },
  { country: "US", city: "San Francisco" },
  { country: "GB", city: "London" },
  { country: "AU", city: "Sydney" },
  { country: "DE", city: "Berlin" },
  { country: "SG", city: "Singapore" },
  { country: "CN", city: "Shanghai" },
  { country: "CA", city: "Toronto" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Skews toward recent days so the trend chart looks like real, growing traffic. */
function randomTimestampWithinDays(days: number) {
  const now = Date.now();
  const skew = Math.pow(Math.random(), 1.6); // closer to 0 = further back
  const msAgo = skew * days * 24 * 60 * 60 * 1000;
  return new Date(now - msAgo);
}

async function seedClicks(linkId: string, count: number, spreadDays: number) {
  const rows = Array.from({ length: count }, () => {
    const os = pick(OS);
    const geo = pick(GEO);
    return {
      linkId,
      createdAt: randomTimestampWithinDays(spreadDays),
      referrer: pick(REFERRERS),
      userAgent: `Mozilla/5.0 (${os}) ${pick(BROWSERS)}/1.0`,
      browser: pick(BROWSERS),
      os,
      deviceType: DEVICE_BY_OS[os] ?? "DESKTOP",
      country: geo.country,
      city: geo.city,
    };
  });
  await prisma.click.createMany({ data: rows });
}

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@snip.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@snip.app",
      passwordHash,
    },
  });

  const LINKS = [
    {
      slug: "launch",
      title: "Timetabler launch post",
      targetUrl: "https://github.com/memorre/class-timetabler-platform",
      clicks: 210,
      days: 30,
    },
    {
      slug: "demo",
      title: "Timetabler live demo",
      targetUrl: "https://timetable.yetao.org",
      clicks: 130,
      days: 21,
    },
    {
      slug: "site",
      title: "Personal site",
      targetUrl: "https://yetao.org",
      clicks: 54,
      days: 30,
    },
    {
      slug: "gh",
      title: "GitHub profile",
      targetUrl: "https://github.com/memorre",
      clicks: 32,
      days: 14,
    },
    {
      slug: "new",
      title: "Fresh link (just created)",
      targetUrl: "https://news.ycombinator.com",
      clicks: 6,
      days: 1,
    },
  ];

  for (const l of LINKS) {
    await prisma.click.deleteMany({ where: { link: { slug: l.slug } } });
    await prisma.link.deleteMany({ where: { slug: l.slug } });
    const link = await prisma.link.create({
      data: {
        slug: l.slug,
        title: l.title,
        targetUrl: l.targetUrl,
        ownerId: user.id,
      },
    });
    await seedClicks(link.id, l.clicks, l.days);
  }

  console.log("Seed complete.");
  console.log("Demo account (password: password123): demo@snip.app");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
