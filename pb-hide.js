/* PataBook — 👁️ दुकानदार तय करे कि public को क्या दिखे
   दुकान की जानकारी में line:  Hide: prods,photos,...   (जो key इस line में है, वह हिस्सा public से छिपा)
   page में हर हिस्से पर data-pbh="key" लगा है। Edit mode (.pbe-on) में मालिक को छिपे हिस्से धुंधले दिखते हैं। */
(function () {
  var KEYS = ["prods", "photos", "about", "hours", "addr", "gst", "web", "vac", "near", "share"];
  var st = document.createElement("style"); document.head.appendChild(st);
  function parse(desc) {
    var m = String(desc || "").match(/^Hide:\s*(.+)$/mi), s = {};
    if (m) m[1].split(/[,\s]+/).forEach(function (k) { if (KEYS.indexOf(k) >= 0) s[k] = 1; });
    return s;
  }
  var CUR = {};
  function apply(desc) {
    CUR = typeof desc === "string" ? parse(desc) : (desc || {});
    var css = "";
    Object.keys(CUR).forEach(function (k) {
      var q = '[data-pbh~="' + k + '"]';
      css += "body:not(.pbe-on) " + q + "{display:none!important}" +
        ".pbe-on " + q + "{opacity:.42;filter:grayscale(1);position:relative}" +
        ".pbe-on section" + q + "::before,.pbe-on div.blk" + q + "::before{content:'🙈 Public से छिपा';position:absolute;left:10px;top:-11px;z-index:7;background:#12141c;color:#fff;font:800 11.5px/1 system-ui,sans-serif;padding:5px 9px;border-radius:999px}";
    });
    st.textContent = css;
    return CUR;
  }
  function has(k) { return !!CUR[k]; }
  window.PBHide = { KEYS: KEYS, parse: parse, apply: apply, has: has, cur: function () { return CUR; } };
})();
