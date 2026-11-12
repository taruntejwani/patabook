// PataBook — sitemap-businesses.xml अपने-आप (GitHub Action से रोज़ रात)
// • सिर्फ़ public जानकारी (publishable key — वही जो website में है; कोई secret नहीं)
// • हर दुकान का वही आख़िरी पता जो ग्राहक को खुलता है:
//     Free → business?slug=…   ·  Paid → shop?slug=…   ·  Platinum + Website Design → brand?slug=…
// • कुछ भी गड़बड़ (नेटवर्क, 0 दुकानें, आधे से कम) → पुरानी फ़ाइल वैसी ही रहती है
import { readFileSync, writeFileSync } from "node:fs";

const SB = "https://kkvbpzysktozghnxplxv.supabase.co";
const KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const FILE = new URL("../sitemap-businesses.xml", import.meta.url);
const SB_BASE = process.env.PB_SB_BASE || SB;   // test के लिए बदला जा सकता है

async function j(path, body) {
  const r = await fetch(SB_BASE + path, body ? { method: "POST", headers: H, body: JSON.stringify(body) } : { headers: H });
  if (!r.ok) throw new Error(path + " → " + r.status);
  return r.json();
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const rows = await j("/rest/v1/businesses?select=slug,updated_at,created_at&is_active=eq.true&deleted_at=is.null&order=created_at.asc&limit=5000");
const shops = rows.filter((b) => b && /^[a-z0-9-]{3,120}$/.test(b.slug || ""));
const old = readFileSync(FILE, "utf8");
const oldN = (old.match(/<url>/g) || []).length;
if (!shops.length || shops.length < Math.floor(oldN / 2)) {
  console.log(`रुक गए: ${shops.length} दुकानें मिलीं (पहले ${oldN}) — फ़ाइल नहीं बदली`);
  process.exit(0);
}
const paid = await j("/rest/v1/rpc/pb_premium_status", { p_slugs: shops.map((b) => b.slug) }).catch(() => null);
if (!paid || typeof paid !== "object") { console.log("plan की जानकारी नहीं मिली — फ़ाइल नहीं बदली"); process.exit(0); }

const out = [];
for (const b of shops) {
  let page = "business";
  if (paid[b.slug]) {
    page = "shop";
    const d = await j("/rest/v1/rpc/pb_design_get", { p_slug: b.slug }).catch(() => 0);
    if (+d >= 1 && +d <= 100) page = "brand";
  }
  const day = String(b.updated_at || b.created_at || "").slice(0, 10) || new Date().toISOString().slice(0, 10);
  out.push(`  <url><loc>https://patabook.in/${page}?slug=${esc(b.slug)}</loc><lastmod>${day}</lastmod><changefreq>weekly</changefreq><priority>${page === "business" ? "0.7" : "0.8"}</priority></url>`);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- PataBook दुकानें: अपने-आप बनती है (scripts/gen-sitemap.mjs) — सिर्फ़ चालू दुकानें, साफ़ पते (बिना .html) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${out.join("\n")}
</urlset>
`;
if (xml === old) { console.log("कोई बदलाव नहीं"); process.exit(0); }
writeFileSync(FILE, xml);
console.log(`sitemap: ${out.length} दुकानें (पहले ${oldN})`);
