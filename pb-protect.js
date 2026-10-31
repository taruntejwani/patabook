/* PataBook — फ़ोटो चोरी रोकने की पहली परत: फ़ोटो को दबाकर रखने / Right-click पर "Save image" न खुले, खींचकर ले जाना बंद।
   (screenshot पूरी तरह नहीं रोका जा सकता; दोहराई फ़ोटो server पर पकड़ी जाती है — pb-gallery.js की hash जाँच) */
(function () {
  try {
    var st = document.createElement("style");
    st.textContent = "img{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}";
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}
  function isImg(e) { var t = e.target; return t && t.tagName === "IMG"; }
  document.addEventListener("contextmenu", function (e) { if (isImg(e)) e.preventDefault(); }, true);
  document.addEventListener("dragstart", function (e) { if (isImg(e)) e.preventDefault(); }, true);
})();
