/* PataBook: सामान्य कॉपी पर रोक (दुकान, सर्च, कैटेगरी, मैप पेज)।
   ध्यान: यह सिर्फ आम कॉपी/राइट-क्लिक रोकता है। असली डेटा सुरक्षा Supabase के नियमों (sql-04) से है।
   स्क्रीनशॉट रोकना ब्राउज़र में संभव नहीं है। फॉर्म, सर्च बॉक्स और लॉगिन पर कोई असर नहीं। */
(function () {
  var st = document.createElement("style");
  st.textContent = "body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
    "input,textarea,select,[contenteditable=true]{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}";
  (document.head || document.documentElement).appendChild(st);
  function editable(t) { return t && t.closest && t.closest("input,textarea,select,[contenteditable=true]"); }
  function stop(e) { if (!editable(e.target)) e.preventDefault(); }
  document.addEventListener("contextmenu", stop);
  document.addEventListener("copy", stop);
  document.addEventListener("cut", stop);
  document.addEventListener("dragstart", stop);
  document.addEventListener("keydown", function (e) {
    var k = String(e.key || "").toLowerCase();
    if ((e.ctrlKey || e.metaKey) && "cuxsa".indexOf(k) >= 0 && k.length === 1 && !editable(e.target)) e.preventDefault();
  });
})();
