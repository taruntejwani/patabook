/* PataBook — 🔥 "आज मुझे क्या चाहिए?" (sql-53)
   • PBNeeds.ownerHTML(b, en) — My Shop → "🔥 ग्राहकों की माँग": शहर + category की खुली माँगें, भाव / जवाब, 🚩 Report
   • ग्राहक की पहचान / नंबर कभी नहीं दिखता; ग्राहक खुद दुकान को Call / WhatsApp करता है (need.html) */
(function () {
  if (window.PBNeeds) return;
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ago(t, en) { var m = Math.max(1, Math.round((Date.now() - new Date(t).getTime()) / 60000)); if (m < 60) return en ? m + " min ago" : m + " मिनट पहले"; var h = Math.round(m / 60); if (h < 48) return en ? h + " h ago" : h + " घंटे पहले"; var d = Math.round(h / 24); return en ? d + " days ago" : d + " दिन पहले"; }
  function call(fn, a) { if (typeof window.rpc === "function") return window.rpc(fn, a); return Promise.reject(new Error("no rpc")); }
  var CH = { Gandhidham: "गांधीधाम", Adipur: "आदिपुर", Anjar: "अंजार", Bhuj: "भुज", Mundra: "मुंद्रा", Mandvi: "मांडवी", Bhachau: "भचाऊ", Rapar: "रापर" };
  var DATA = {};
  function box(slug) { var a = document.querySelectorAll(".pbnd"); for (var i = 0; i < a.length; i++) if (a[i].getAttribute("data-ndslug") === slug) return a[i]; return null; }
  function ownerHTML(b, en) {
    setTimeout(function () { load(b.slug); }, 0);
    return '<div class="pbnd" data-ndslug="' + esc(b.slug) + '"><p style="margin:0 0 10px;color:#5b6475;font-size:14px;line-height:1.5">' +
      esc(en ? "Customers in your city post what they need. Send your price or reply — the customer sees your shop and contacts you. You never see the customer's name or number." : "आपके शहर के ग्राहक अपनी ज़रूरत लिखते हैं। अपना भाव या जवाब भेजें — ग्राहक आपकी दुकान देखकर खुद संपर्क करेगा। ग्राहक का नाम या नंबर आपको नहीं दिखता।") +
      '</p><div data-ndl><p style="color:#5b6475">…</p></div></div>';
  }
  function draw(slug) {
    var el = box(slug); if (!el) return; var en = EN(), L = DATA[slug] || [];
    el.querySelector("[data-ndl]").innerHTML = !L.length ? '<p style="color:#5b6475;font-size:14px">' + esc(en ? "No open requests for your shop right now." : "अभी आपकी दुकान के लिए कोई खुली माँग नहीं है।") + '</p>' :
      L.map(function (n) {
        var mine = n.mine || null;
        return '<div style="border:1px solid #ffd8a8;background:#fffaf2;border-radius:12px;padding:10px 12px;margin-bottom:10px">' +
          '<small style="display:block;color:#7a5a2b">📍 ' + esc(n.city) + ' · ' + esc(ago(n.at, en)) + ' · ' + esc(en ? n.replies + " replies" : n.replies + " जवाब") + '</small>' +
          '<p style="margin:4px 0 8px;font-size:15px;white-space:pre-line">' + esc(n.body) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input type="number" inputmode="decimal" min="0" data-ndp="' + n.id + '" placeholder="₹ ' + esc(en ? "Price (optional)" : "भाव (वैकल्पिक)") + '" value="' + (mine && mine.price != null ? esc(mine.price) : "") + '" style="width:130px;font:inherit;padding:8px;border:1px solid #d0d5dd;border-radius:8px">' +
          '<input data-ndb="' + n.id + '" maxlength="200" placeholder="' + esc(en ? "Your reply (e.g. available today)" : "आपका जवाब (जैसे आज मिल जाएगा)") + '" value="' + (mine ? esc(mine.body) : "") + '" style="flex:1;min-width:160px;font:inherit;padding:8px;border:1px solid #d0d5dd;border-radius:8px"></div>' +
          '<div style="display:flex;gap:8px;margin-top:8px;align-items:center"><button type="button" data-nds="' + n.id + '" style="border:0;border-radius:10px;background:#f08c00;color:#fff;font:inherit;font-weight:700;padding:9px 14px;cursor:pointer">' + esc(mine ? (en ? "Update reply" : "जवाब बदलें") : (en ? "Send reply" : "जवाब भेजें")) + '</button>' +
          (n.reported ? '<small style="color:#98a2b3">' + esc(en ? "Reported" : "Report किया") + '</small>' : '<button type="button" data-ndr="' + n.id + '" style="border:0;background:none;color:#98a2b3;font:inherit;font-size:13px;cursor:pointer">🚩 ' + esc(en ? "Spam" : "Spam / गलत") + '</button>') +
          '<span data-ndm="' + n.id + '" style="font-size:13px"></span></div></div>';
      }).join("");
  }
  function load(slug) {
    call("pb_needs_for_shop", { p_slug: slug }).then(function (j) { DATA[slug] = Array.isArray(j) ? j : []; draw(slug); }).catch(function (e) {
      var el = box(slug); if (!el) return;
      el.querySelector("[data-ndl]").innerHTML = '<p style="color:#b42318;font-size:14px">' + esc(/404|PGRST202|function/i.test(String(e && e.message)) ? (EN() ? "This feature is being switched on. Please try again later." : "यह सुविधा अभी चालू हो रही है। थोड़ी देर बाद फिर कोशिश करें।") : (EN() ? "Could not load requests." : "माँगें नहीं खुल पाईं।")) + '</p>';
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-nds],[data-ndr]"); if (!t) return;
    var el = t.closest(".pbnd"); if (!el) return; var slug = el.getAttribute("data-ndslug"), en = EN();
    if (t.hasAttribute("data-ndr")) {
      if (t.dataset.armed !== "1") { t.dataset.armed = "1"; t.textContent = en ? "Tap again to report" : "Report के लिए फिर दबाएँ"; return; }
      t.disabled = true; call("pb_need_report", { p_slug: slug, p_need: +t.dataset.ndr }).then(function () { load(slug); }).catch(function () { t.disabled = false; });
      return;
    }
    var id = t.dataset.nds, pv = el.querySelector('[data-ndp="' + id + '"]').value.trim(), bv = el.querySelector('[data-ndb="' + id + '"]').value.trim(), m = el.querySelector('[data-ndm="' + id + '"]');
    var price = pv === "" ? null : Number(pv);
    if (price != null && !(price >= 0)) { m.style.color = "#b42318"; m.textContent = en ? "Enter a valid price." : "सही भाव लिखें।"; return; }
    if (price == null && bv.length < 2) { m.style.color = "#b42318"; m.textContent = en ? "Write a price or a reply." : "भाव या जवाब लिखें।"; return; }
    t.disabled = true; m.style.color = "#5b6475"; m.textContent = en ? "Sending…" : "भेज रहे हैं…";
    call("pb_need_reply", { p_slug: slug, p_need: +id, p_price: price, p_body: bv }).then(function () { m.style.color = "#1e8e3e"; m.textContent = en ? "✅ Sent" : "✅ भेज दिया"; setTimeout(function () { load(slug); }, 900); })
      .catch(function (er) { var s = String(er && er.message); m.style.color = "#b42318"; m.textContent = /closed/.test(s) ? (en ? "This request is closed." : "यह माँग बंद हो चुकी है।") : /rate/.test(s) ? (en ? "Too many replies today." : "आज बहुत जवाब भेजे।") : (en ? "Could not send." : "भेज नहीं पाए।"); })
      .then(function () { t.disabled = false; });
  });
  window.PBNeeds = { ownerHTML: ownerHTML };
})();
