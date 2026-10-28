// patabook.in/sitemap-shops.xml — हर दुकान का पता अपने-आप (Cloudflare Pages Function)
const SB = "https://kkvbpzysktozghnxplxv.supabase.co";
const KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function allSlugs() {
  const out = [];
  for (let off = 0; off < 20000; off += 1000) {
    const u = SB + "/rest/v1/businesses?select=slug&is_active=eq.true&deleted_at=is.null&order=slug&limit=1000&offset=" + off;
    const r = await fetch(u, { headers: H });
    if (!r.ok) throw new Error("businesses " + r.status);
    const rows = await r.json();
    for (const x of rows) if (x && x.slug) out.push(x.slug);
    if (rows.length < 1000) break;
  }
  return out;
}

async function premiumMap(slugs) {
  const m = {};
  for (let i = 0; i < slugs.length; i += 100) {
    try {
      const r = await fetch(SB + "/rest/v1/rpc/pb_premium_status", { method: "POST", headers: H, body: JSON.stringify({ p_slugs: slugs.slice(i, i + 100) }) });
      if (r.ok) Object.assign(m, await r.json());
    } catch (e) {}
  }
  return m;
}

export async function onRequestGet({ request }) {
  const cache = caches.default;
  const key = new Request(new URL(request.url).origin + "/sitemap-shops.xml");
  const hit = await cache.match(key);
  if (hit) return hit;
  try {
    const slugs = await allSlugs();
    const prem = await premiumMap(slugs);
    const urls = slugs.map((s) => {
      const page = prem[s] ? "shop.html" : "business.html";   // premium दुकान का अपना page shop.html है
      return "  <url><loc>" + esc("https://patabook.in/" + page + "?slug=" + encodeURIComponent(s)) + "</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>";
    });
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join("\n") + "\n</urlset>\n";
    const res = new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
    await cache.put(key, res.clone());
    return res;
  } catch (e) {
    return new Response("sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "600" } });
  }
}
