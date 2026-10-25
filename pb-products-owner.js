/* PataBook — My Shop: 🛍️ Products (sql-24, सिर्फ़ Premium)
   दुकानदार product जोड़े / बदले / छिपाए / Stock / ⭐ ऊपर / हटाए। फ़ोटो shop-logos/<slug>/prod-*.webp में।
   mybusiness.html की चीज़ें इस्तेमाल होती हैं: rpc, esc, L, $, ME, PBA, SB, KEY, ROWS, draw, resizeImage */
(function () {
  var PRD = {};
  var SIZES = ["100 ML", "200 ML", "500 ML", "1 Ltr", "5 Ltr", "20 Ltr", "1 Kg", "5 Kg"];
  var IMG_RX = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  var css = document.createElement("style");
  css.textContent =
    "@media(min-width:480px){.pm .pb{grid-template-columns:repeat(4,1fr)}}" +
    ".pr-add{width:100%;display:flex;align-items:center;gap:10px;margin-top:10px;border:2px dashed #9fc0f5;background:#f4f8ff;border-radius:14px;padding:10px 12px;font:inherit;text-align:left;cursor:pointer}" +
    ".pr-add i{font-style:normal;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:22px;color:#fff;background:radial-gradient(circle at 30% 25%,#7fb6ff,#1a73e8 72%);flex:none}" +
    ".pr-add b{display:block;font-size:14.5px;color:#123568}.pr-add small{display:block;font-size:12px;color:#5b6475}" +
    ".pr-l{display:flex;flex-direction:column;gap:8px;margin-top:10px}" +
    ".pr-i{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #e4eaf5;border-radius:14px;padding:8px}" +
    ".pr-i.hid{opacity:.55}.pr-i .th{width:58px;height:58px;border-radius:10px;background:#0d0d10;overflow:hidden;flex:none}.pr-i .th img{width:100%;height:100%;object-fit:contain;display:block}" +
    ".pr-i .tx{flex:1;min-width:0}.pr-i .tx b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pr-i .tx small{display:block;font-size:12px;color:#5b6475}" +
    ".pr-st{display:inline-block;margin-top:3px;font-size:10.5px;font-weight:800;border-radius:999px;padding:2px 7px}.pr-st.on{background:#e3f7ea;color:#137333}.pr-st.hid{background:#eceff3;color:#5b6475}.pr-st.out{background:#fdecea;color:#c5221f}" +
    ".pr-a{display:grid;grid-template-columns:repeat(2,34px);gap:5px;flex:none}.pr-a button{width:34px;height:34px;border-radius:10px;border:0;font-size:15px;cursor:pointer;background:#f1f4f9}" +
    ".pr-a .e{background:#eef4ff}.pr-a .s{background:#fff6dc}.pr-a .d{background:#fdecea}" +
    ".pr-lg{display:flex;gap:10px;flex-wrap:wrap;font-size:11.5px;color:#5b6475;margin-top:8px}" +
    ".pr-sc{position:fixed;inset:0;z-index:9990;background:rgba(10,20,40,.5);display:flex;align-items:flex-end;justify-content:center}" +
    ".pr-sh{width:100%;max-width:600px;max-height:92vh;overflow:auto;background:#fff;border-radius:22px 22px 0 0;padding:14px 16px calc(18px + env(safe-area-inset-bottom));font-size:15px}" +
    "@media(min-width:640px){.pr-sc{align-items:center}.pr-sh{border-radius:22px}}" +
    ".pr-hd{display:flex;align-items:center;gap:10px;margin-bottom:8px}.pr-hd b{font-size:17px;color:#123568}.pr-hd button{margin-left:auto;width:34px;height:34px;border-radius:50%;border:0;background:#f1f4f9;cursor:pointer}" +
    ".pr-pk{display:flex;gap:10px;align-items:center}.pr-pv{width:88px;height:88px;border-radius:14px;background:#0d0d10;overflow:hidden;flex:none;display:grid;place-items:center;color:#9aa3b5;font-size:28px}.pr-pv img{width:100%;height:100%;object-fit:contain}" +
    ".pr-pk .bt{display:flex;flex-direction:column;gap:6px;flex:1}.pr-pk label,.pr-pk button{display:block;text-align:center;border:1.5px solid #e4eaf5;background:#fff;border-radius:12px;padding:10px;font:inherit;font-weight:800;font-size:13.5px;color:#123568;cursor:pointer}" +
    ".pr-f{display:block;font-size:12.5px;font-weight:700;color:#5b6475;margin:11px 2px 5px}" +
    ".pr-in{width:100%;border:1.5px solid #e4eaf5;border-radius:12px;padding:11px 12px;font:inherit;font-size:15px;background:#fbfcfe}.pr-in:focus{outline:0;border-color:#1a73e8;background:#fff}" +
    ".pr-sz{display:flex;gap:6px;flex-wrap:wrap}.pr-sz button{border:1.5px solid #e4eaf5;background:#fff;border-radius:999px;padding:7px 11px;font:inherit;font-weight:700;font-size:13px;cursor:pointer}.pr-sz button.on{background:#123568;border-color:#123568;color:#fff}" +
    ".pr-ch{display:flex;gap:6px;flex-wrap:wrap}.pr-ch span{display:inline-flex;align-items:center;gap:6px;background:#eef4ff;color:#123568;border-radius:999px;padding:6px 6px 6px 11px;font-size:13px;font-weight:700}" +
    ".pr-ch span button{border:0;width:20px;height:20px;border-radius:50%;background:#fff;color:#c5221f;font-size:11px;cursor:pointer}" +
    ".pr-af{display:flex;gap:6px;margin-top:8px}.pr-af button{border:0;border-radius:12px;padding:0 14px;background:#1a73e8;color:#fff;font-weight:800;font-size:18px;cursor:pointer}" +
    ".pr-tg{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid #e4eaf5;border-radius:14px;margin-top:9px;font-weight:700;font-size:14px}.pr-tg small{display:block;font-size:12px;color:#5b6475;font-weight:500}" +
    ".pr-tg input{width:22px;height:22px;accent-color:#137333;flex:none}" +
    ".pr-sv{width:100%;margin-top:14px;border:0;border-radius:14px;padding:14px;font:inherit;font-size:15.5px;font-weight:800;background:#1a73e8;color:#fff;cursor:pointer}.pr-sv:disabled{opacity:.6}" +
    ".pr-dl{width:100%;margin-top:8px;border:0;border-radius:14px;padding:12px;font:inherit;font-weight:800;background:#fdecea;color:#c5221f;cursor:pointer}" +
    ".pr-er{color:#c5221f;font-size:13px;font-weight:700;margin-top:8px;min-height:1px}" +
    ".pr-mul{width:100%;display:flex;align-items:center;gap:10px;margin-top:8px;border:2px dashed #e2b34c;background:#fffaf0;border-radius:14px;padding:10px 12px;font:inherit;text-align:left;cursor:pointer}" +
    ".pr-mul i{font-style:normal;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:20px;background:linear-gradient(135deg,#f6e3a8,#d9b257 45%,#B58A2A);flex:none}" +
    ".pr-mul b{display:block;font-size:14.5px;color:#7a5a14}.pr-mul small{display:block;font-size:12px;color:#5b6475}" +
    ".mp-r{border:1.5px solid #e4eaf5;border-radius:16px;padding:10px;margin-top:10px;background:#fbfcfe}.mp-r.bad{border-color:#e5484d;background:#fff5f5}.mp-r.ok{border-color:#9ad7ae;background:#f2fbf5}" +
    ".mp-h{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:800;color:#123568;margin-bottom:6px}.mp-h button{border:0;background:#fdecea;border-radius:10px;width:32px;height:30px;cursor:pointer}" +
    ".mp-g{display:flex;gap:10px}.mp-ph{width:84px;height:84px;flex:none;border-radius:12px;background:#0d0d10;color:#9aa3b5;display:grid;place-items:center;font-size:24px;overflow:hidden;cursor:pointer;position:relative;text-align:center}.mp-ph img{width:100%;height:100%;object-fit:contain}.mp-ph small{position:absolute;bottom:4px;left:0;right:0;font-size:10.5px;color:#fff;font-weight:700}" +
    ".mp-f{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.mp-f .pr-in{padding:9px 10px;font-size:14.5px}.mp-two{display:flex;gap:6px}.mp-two .pr-in{min-width:0}" +
    ".mp-sz{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none;margin-top:6px}.mp-sz::-webkit-scrollbar{display:none}.mp-sz button{flex:none;border:1.5px solid #e4eaf5;background:#fff;border-radius:999px;padding:5px 9px;font:inherit;font-weight:700;font-size:12px;cursor:pointer}.mp-sz button.on{background:#123568;border-color:#123568;color:#fff}" +
    ".mp-e{color:#c5221f;font-size:12px;font-weight:700;margin-top:5px}.mp-add{width:100%;margin-top:10px;border:1.5px dashed #9fc0f5;background:#f4f8ff;border-radius:14px;padding:12px;font:inherit;font-weight:800;color:#123568;cursor:pointer}";
  document.head.appendChild(css);

  function en() { return L() === "en"; }
  function rs(n) { return n ? "₹" + Number(n).toLocaleString("en-IN") : ""; }

  window.prodLoad = async function (slug) {
    ME = await PBA.session();
    PRD[slug] = (await rpc("pb_my_products", { p_slug: slug })) || [];
  };

  window.prodBody = function (b, i) {
    var list = PRD[b.slug];
    if (!list) return '<div class="pr-l"><small>…</small></div>';
    var E = en();
    return '<button type="button" class="pr-add" data-padd="' + i + '"' + (list.length >= 20 ? " disabled" : "") + '><i>＋</i><span><b>' + (E ? "Add a product" : "नया Product जोड़ें") + '</b><small>' +
      (E ? "Photo, name, size, price · " + list.length + " / 20" : "फ़ोटो, नाम, size, कीमत · " + list.length + " / 20") + '</small></span></button>' +
      (list.length < 20 ? '<button type="button" class="pr-mul" data-pmul="' + i + '"><i>📋</i><span><b>' + (E ? "Add many products (Multiple)" : "एक साथ कई Products (Multiple)") + '</b><small>' + (E ? "Photo, name, size, price — add one after another, save all" : "फ़ोटो, नाम, size, कीमत — एक के बाद एक जोड़ें, सब एक साथ Save") + '</small></span></button>' : '') +
      '<div class="pr-l">' + list.map(function (p) {
        var st = !p.show ? '<span class="pr-st hid">🙈 ' + (E ? "Hidden" : "छिपा है") + '</span>' : p.stock ? '<span class="pr-st on">✅ ' + (E ? "Visible" : "दिख रहा है") + '</span>' : '<span class="pr-st out">⛔ ' + (E ? "Out of stock" : "Stock खत्म") + '</span>';
        return '<div class="pr-i' + (p.show ? "" : " hid") + '"><div class="th">' + (IMG_RX.test(p.img || "") ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : "") + '</div>' +
          '<div class="tx"><b>' + (p.best ? "⭐ " : "") + esc(p.name) + '</b><small>' + esc(p.size || "") + (p.mrp ? " · " + rs(p.mrp) : "") + '</small>' + st + '</div>' +
          '<div class="pr-a"><button type="button" class="e" data-ped="' + i + '" data-id="' + p.id + '" aria-label="Edit">✏️</button>' +
          '<button type="button" data-psw="' + i + '" data-id="' + p.id + '" aria-label="Show / hide">' + (p.show ? "👁️" : "🙈") + '</button>' +
          '<button type="button" class="s" data-pbe="' + i + '" data-id="' + p.id + '" aria-label="Top">' + (p.best ? "⭐" : "☆") + '</button>' +
          '<button type="button" class="d" data-pdl="' + i + '" data-id="' + p.id + '" aria-label="Delete">🗑️</button></div></div>';
      }).join("") + '</div>' +
      (list.length ? '<div class="pr-lg"><span>✏️ ' + (E ? "edit" : "बदलें") + '</span><span>👁️/🙈 ' + (E ? "show / hide" : "दिखाएँ / छिपाएँ") + '</span><span>⭐ ' + (E ? "on top" : "सबसे ऊपर") + '</span><span>🗑️ ' + (E ? "delete" : "हटाएँ") + '</span></div>' : "");
  };

  async function refresh(slug) { try { await window.prodLoad(slug); } catch (e) {} draw(); }

  function sheet(b, p) {
    var E = en();
    var D = p ? JSON.parse(JSON.stringify(p)) : { name: "", size: "", mrp: "", feats: [], img: "", show: true, stock: true };
    D.feats = D.feats || [];
    var sc = document.createElement("div"); sc.className = "pr-sc";
    function keep() {
      var n = sc.querySelector("#prN"); if (!n) return;
      D.name = n.value; D.mrp = sc.querySelector("#prM").value.replace(/\D/g, "");
      D.stock = sc.querySelector("#prS").checked; D.show = sc.querySelector("#prV").checked;
      var cs = sc.querySelector("#prCS"); if (cs && cs.value.trim()) D.size = cs.value.trim();
    }
    function body() {
      return '<div class="pr-sh"><div class="pr-hd"><b>' + (p ? (E ? "✏️ Edit product" : "✏️ Product बदलें") : (E ? "➕ New product" : "➕ नया Product")) + '</b><button type="button" id="prX" aria-label="Close">✕</button></div>' +
        '<div class="pr-pk"><div class="pr-pv">' + (D.img ? '<img src="' + esc(D.img) + '" alt="">' : "📷") + '</div><div class="bt"><label>📷 ' + (D.img ? (E ? "Change photo" : "फ़ोटो बदलें") : (E ? "Add photo" : "फ़ोटो लगाएँ")) +
        '<input type="file" accept="image/*" hidden id="prF"></label></div></div><div class="pr-er" id="prE1"></div>' +
        '<label class="pr-f" for="prN">' + (E ? "Product name" : "Product का नाम") + '</label><input class="pr-in" id="prN" maxlength="80" value="' + esc(D.name) + '" placeholder="' + (E ? "e.g. Tyre Polish" : "जैसे: Tyre Polish") + '">' +
        '<span class="pr-f">Size</span><div class="pr-sz" id="prZ">' + SIZES.map(function (z) { return '<button type="button" class="' + (D.size === z ? "on" : "") + '">' + z + '</button>'; }).join("") + '</div>' +
        '<input class="pr-in" id="prCS" maxlength="30" style="margin-top:6px" placeholder="' + (E ? "Other size (optional)" : "दूसरा size लिखें (ज़रूरी नहीं)") + '" value="' + (SIZES.indexOf(D.size) < 0 ? esc(D.size || "") : "") + '">' +
        '<label class="pr-f" for="prM">MRP (₹) — ' + (E ? "leave empty to show “Ask price”" : "खाली छोड़ेंगे तो “कीमत पूछें” दिखेगा") + '</label><input class="pr-in" id="prM" inputmode="numeric" maxlength="9" value="' + esc(D.mrp || "") + '" placeholder="1499">' +
        '<span class="pr-f">' + (E ? "Features (up to 8)" : "खूबियाँ (8 तक)") + '</span><div class="pr-ch" id="prC">' + (D.feats.length ? D.feats.map(function (f, k) { return '<span>' + esc(f) + '<button type="button" data-rf="' + k + '" aria-label="Remove">✕</button></span>'; }).join("") : '<small style="color:#5b6475">' + (E ? "None yet" : "अभी कोई नहीं") + '</small>') + '</div>' +
        (D.feats.length < 8 ? '<div class="pr-af"><input class="pr-in" id="prNF" maxlength="40" placeholder="' + (E ? "e.g. Non Greasy" : "जैसे: Non Greasy") + '"><button type="button" id="prAF" aria-label="Add">＋</button></div>' : "") +
        '<label class="pr-tg"><span>✅ ' + (E ? "In stock" : "Stock में है") + '<small>' + (E ? "Off = shows “Out of stock”" : "बंद = “अभी Stock में नहीं” दिखेगा") + '</small></span><input type="checkbox" id="prS"' + (D.stock ? " checked" : "") + '></label>' +
        '<label class="pr-tg"><span>👁️ ' + (E ? "Show to customers" : "ग्राहकों को दिखाएँ") + '<small>' + (E ? "Off = hidden, not deleted" : "बंद = छिप जाएगा, हटेगा नहीं") + '</small></span><input type="checkbox" id="prV"' + (D.show ? " checked" : "") + '></label>' +
        '<div class="pr-er" id="prE"></div><button type="button" class="pr-sv" id="prSave">✔ ' + (E ? "Save" : "Save करें") + '</button>' +
        (p ? '<button type="button" class="pr-dl" id="prDel">🗑️ ' + (E ? "Delete this product" : "यह Product हटाएँ") + '</button>' : "") + '</div>';
    }
    function paint() { sc.innerHTML = body(); wire(); }
    function wire() {
      sc.querySelector("#prX").onclick = function () { sc.remove(); };
      sc.querySelector("#prZ").onclick = function (e) { var t = e.target.closest("button"); if (!t) return; keep(); D.size = D.size === t.textContent ? "" : t.textContent; sc.querySelector("#prCS").value = ""; paint(); };
      sc.querySelector("#prC").onclick = function (e) { var t = e.target.closest("[data-rf]"); if (!t) return; keep(); D.feats.splice(+t.dataset.rf, 1); paint(); };
      var af = sc.querySelector("#prAF");
      function addF() { var v = sc.querySelector("#prNF").value.trim(); if (!v) return; keep(); D.feats.push(v.slice(0, 40)); paint(); var nf = sc.querySelector("#prNF"); if (nf) nf.focus(); }
      if (af) { af.onclick = addF; sc.querySelector("#prNF").onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); addF(); } }; }
      sc.querySelector("#prF").onchange = async function () {
        var f = this.files && this.files[0]; if (!f) return; keep();
        var er = sc.querySelector("#prE1"); er.textContent = E ? "Uploading…" : "Upload हो रहा है…";
        try {
          if (!/^image\//.test(f.type)) throw new Error("type");
          ME = await PBA.session();
          var blob = await resizeImage(f, 900), ext = blob.type === "image/webp" ? "webp" : "jpg";
          var path = encodeURIComponent(b.slug) + "/prod-" + Date.now() + "." + ext;
          var up = await fetch(SB + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ME.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
          if (!up.ok) throw new Error("upload");
          D.img = SB + "/storage/v1/object/public/shop-logos/" + path; paint();
        } catch (x) { var e1 = sc.querySelector("#prE1"); if (e1) e1.textContent = E ? "Could not upload the photo. Try again." : "फ़ोटो upload नहीं हुई। फिर कोशिश करें।"; }
      };
      sc.querySelector("#prSave").onclick = async function () {
        keep(); var er = sc.querySelector("#prE"), btn = this;
        if (String(D.name || "").trim().length < 2) { er.textContent = E ? "Write the product name." : "Product का नाम लिखें।"; return; }
        if (!D.img) { er.textContent = E ? "Add a photo." : "फ़ोटो लगाएँ।"; return; }
        btn.disabled = true; er.textContent = "";
        try {
          ME = await PBA.session();
          await rpc("pb_product_save", { p_slug: b.slug, p: { id: p ? p.id : null, name: D.name.trim(), size: D.size || "", mrp: D.mrp || "", feats: D.feats, img: D.img, show: D.show, stock: D.stock } });
          sc.remove(); refresh(b.slug);
        } catch (x) {
          btn.disabled = false; var m = String(x.message || "");
          er.textContent = /too many/.test(m) ? (E ? "Max 20 products." : "20 से ज़्यादा products नहीं।") : /premium/.test(m) ? (E ? "Premium is needed." : "Premium ज़रूरी है।") : /bad mrp/.test(m) ? (E ? "Check the price." : "कीमत ठीक लिखें।") : (E ? "Could not save. Try again." : "Save नहीं हुआ। फिर कोशिश करें।");
        }
      };
      var dl = sc.querySelector("#prDel"); if (dl) dl.onclick = function () { sc.remove(); del(b, p); };
    }
    sc.onclick = function (e) { if (e.target === sc) sc.remove(); };
    document.body.appendChild(sc); paint();
  }

  /* 📋 एक साथ कई Products: हर box में फ़ोटो + नाम + size + कीमत, "एक और" से box जुड़ता जाए, आख़िर में सब Save */
  function multi(b) {
    var E = en(), left = 20 - (PRD[b.slug] || []).length;
    var R = [{ name: "", size: "", mrp: "", img: "", up: false, err: "", ok: false }];
    var sc = document.createElement("div"); sc.className = "pr-sc";
    function keep() {
      sc.querySelectorAll(".mp-r").forEach(function (el) {
        var k = +el.dataset.k, r = R[k]; if (!r) return;
        r.name = el.querySelector(".mpN").value; r.mrp = el.querySelector(".mpM").value.replace(/\D/g, "");
        var cs = el.querySelector(".mpS").value.trim(); r.size = cs;
      });
    }
    function row(r, k) {
      return '<div class="mp-r' + (r.ok ? " ok" : r.err ? " bad" : "") + '" data-k="' + k + '"><div class="mp-h"><span>' + (r.ok ? "✅ " : "") + "Product " + (k + 1) + '</span>' +
        (R.length > 1 && !r.ok ? '<button type="button" data-rm="' + k + '" aria-label="Remove">🗑️</button>' : "") + '</div>' +
        '<div class="mp-g"><label class="mp-ph">' + (r.img ? '<img src="' + esc(r.img) + '" alt="">' : r.up ? "⏳" : "📷") + '<small>' + (r.img ? (E ? "Change" : "बदलें") : (E ? "Photo" : "फ़ोटो")) + '</small>' +
        '<input type="file" accept="image/*" hidden data-f="' + k + '"></label>' +
        '<div class="mp-f"><input class="pr-in mpN" maxlength="80" value="' + esc(r.name) + '" placeholder="' + (E ? "Product name" : "Product का नाम") + '">' +
        '<div class="mp-two"><input class="pr-in mpS" maxlength="30" value="' + esc(r.size) + '" placeholder="Size"><input class="pr-in mpM" inputmode="numeric" maxlength="9" value="' + esc(r.mrp) + '" placeholder="' + (E ? "Price ₹" : "कीमत ₹") + '"></div></div></div>' +
        '<div class="mp-sz">' + SIZES.map(function (z) { return '<button type="button" data-sz="' + k + '" class="' + (r.size === z ? "on" : "") + '">' + z + '</button>'; }).join("") + '</div>' +
        (r.err ? '<div class="mp-e">' + esc(r.err) + '</div>' : "") + '</div>';
    }
    function paint() {
      var todo = R.filter(function (r) { return !r.ok; }).length;
      sc.innerHTML = '<div class="pr-sh"><div class="pr-hd"><b>📋 ' + (E ? "Add many products" : "एक साथ कई Products") + '</b><button type="button" id="mpX" aria-label="Close">✕</button></div>' +
        '<small style="color:#5b6475">' + (E ? "Fill photo, name, size and price. Price empty = “Ask price”. You can add " + left + " more." : "फ़ोटो, नाम, size और कीमत भरें। कीमत खाली = “कीमत पूछें”। अभी " + left + " और जोड़ सकते हैं।") + '</small>' +
        R.map(row).join("") +
        (R.length < left ? '<button type="button" class="mp-add" id="mpAdd">➕ ' + (E ? "Add one more product" : "एक और Product जोड़ें") + '</button>' : "") +
        '<div class="pr-er" id="mpE"></div><button type="button" class="pr-sv" id="mpSave"' + (todo ? "" : " disabled") + '>✔ ' + (E ? "Save all (" + todo + ")" : "सब Save करें (" + todo + ")") + '</button></div>';
    }
    sc.addEventListener("click", async function (e) {
      if (e.target === sc || e.target.closest("#mpX")) { if (R.some(function (r) { return !r.ok && (r.name || r.img); }) && !confirm(E ? "Close without saving?" : "बिना Save किए बंद करें?")) return; sc.remove(); refresh(b.slug); return; }
      var t;
      if (e.target.closest("#mpAdd")) { keep(); R.push({ name: "", size: "", mrp: "", img: "", up: false, err: "", ok: false }); paint(); var all = sc.querySelectorAll(".mp-r"); all[all.length - 1].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      if ((t = e.target.closest("[data-rm]"))) { keep(); R.splice(+t.dataset.rm, 1); paint(); return; }
      if ((t = e.target.closest("[data-sz]"))) { keep(); var r = R[+t.dataset.sz]; r.size = r.size === t.textContent ? "" : t.textContent; paint(); return; }
      if (e.target.closest("#mpSave")) {
        keep(); var btn = sc.querySelector("#mpSave"), er = sc.querySelector("#mpE"), bad = 0;
        R.forEach(function (r) { if (r.ok) return; r.err = String(r.name || "").trim().length < 2 ? (E ? "Write the name." : "नाम लिखें।") : !r.img ? (r.up ? (E ? "Photo still uploading…" : "फ़ोटो अभी upload हो रही है…") : (E ? "Add a photo." : "फ़ोटो लगाएँ।")) : ""; if (r.err) bad++; });
        if (bad) { paint(); sc.querySelector("#mpE").textContent = E ? "Fix the red boxes." : "लाल box ठीक करें।"; return; }
        btn.disabled = true; er.textContent = E ? "Saving…" : "Save हो रहा है…";
        try { ME = await PBA.session(); } catch (x) {}
        for (var k = 0; k < R.length; k++) {
          var r = R[k]; if (r.ok) continue;
          try { await rpc("pb_product_save", { p_slug: b.slug, p: { id: null, name: r.name.trim(), size: r.size || "", mrp: r.mrp || "", feats: [], img: r.img, show: true, stock: true } }); r.ok = true; r.err = ""; left--; }
          catch (x) { var m = String(x.message || ""); r.err = /too many/.test(m) ? (E ? "Max 20 products." : "20 से ज़्यादा नहीं।") : /bad mrp/.test(m) ? (E ? "Check the price." : "कीमत ठीक लिखें।") : /premium/.test(m) ? (E ? "Premium is needed." : "Premium ज़रूरी है।") : (E ? "Could not save. Try again." : "Save नहीं हुआ, फिर कोशिश करें।"); }
        }
        if (R.every(function (r) { return r.ok; })) { sc.remove(); refresh(b.slug); return; }
        paint(); sc.querySelector("#mpE").textContent = E ? "Some were not saved — see red boxes." : "कुछ Save नहीं हुए — लाल box देखें।";
      }
    });
    sc.addEventListener("change", async function (e) {
      var inp = e.target.closest("[data-f]"); if (!inp) return;
      var f = inp.files && inp.files[0], k = +inp.dataset.f, r = R[k]; if (!f || !r) return;
      keep(); r.up = true; r.err = ""; paint();
      try {
        if (!/^image\//.test(f.type)) throw new Error("type");
        ME = await PBA.session();
        var blob = await resizeImage(f, 900), ext = blob.type === "image/webp" ? "webp" : "jpg";
        var path = encodeURIComponent(b.slug) + "/prod-" + Date.now() + "-" + k + "." + ext;
        var up = await fetch(SB + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ME.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
        if (!up.ok) throw new Error("upload");
        r.img = SB + "/storage/v1/object/public/shop-logos/" + path;
      } catch (x) { r.err = E ? "Could not upload the photo. Try again." : "फ़ोटो upload नहीं हुई। फिर कोशिश करें।"; }
      r.up = false; keep(); paint();
    });
    document.body.appendChild(sc); paint();
  }

  async function del(b, p) {
    if (!confirm((en() ? "Delete “" : "“") + p.name + (en() ? "”? To only hide it, use 👁️." : "” हटाएँ? सिर्फ़ छिपाना हो तो 👁️ दबाएँ।"))) return;
    try { ME = await PBA.session(); await rpc("pb_product_remove", { p_slug: b.slug, p_id: p.id }); } catch (x) {}
    refresh(b.slug);
  }
  async function flag(b, p, f, on) {
    try { ME = await PBA.session(); await rpc("pb_product_flag", { p_slug: b.slug, p_id: p.id, p_flag: f, p_on: on }); } catch (x) {}
    refresh(b.slug);
  }

  document.getElementById("list").addEventListener("click", function (e) {
    var t = e.target.closest("[data-padd],[data-pmul],[data-ped],[data-psw],[data-pbe],[data-pdl]"); if (!t) return;
    var i = +(t.dataset.padd || t.dataset.pmul || t.dataset.ped || t.dataset.psw || t.dataset.pbe || t.dataset.pdl), b = ROWS && ROWS[i]; if (!b) return;
    if (t.hasAttribute("data-padd")) return sheet(b, null);
    if (t.hasAttribute("data-pmul")) return multi(b);
    var p = (PRD[b.slug] || []).filter(function (x) { return x.id === +t.dataset.id; })[0]; if (!p) return;
    if (t.hasAttribute("data-ped")) return sheet(b, p);
    if (t.hasAttribute("data-psw")) return flag(b, p, "show", !p.show);
    if (t.hasAttribute("data-pbe")) return flag(b, p, "best", !p.best);
    if (t.hasAttribute("data-pdl")) return del(b, p);
  });
})();
