const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/l/I

export function randomSlug(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

const RESERVED = new Set(["login", "dashboard", "api", "favicon.ico", "_next"]);

export function isReservedSlug(slug: string) {
  return RESERVED.has(slug.toLowerCase());
}

const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

export function isValidSlug(slug: string) {
  return SLUG_PATTERN.test(slug) && !isReservedSlug(slug);
}
