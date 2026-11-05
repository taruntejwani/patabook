/* PataBook: सिर्फ़ फ़ोटो की सुरक्षा (दुकान, सर्च, कैटेगरी, मैप पेज)।
   Text (पता, नंबर, नाम) अब copy हो सकता है — ग्राहक को ज़रूरत होती है।
   फ़ोटो पर लंबा दबाना / Right-click "Save image" / खींचकर ले जाना बंद (pb-protect.js जैसा)।
   असली डेटा सुरक्षा Supabase के नियमों (sql-04) से है। */
(function () {
  var st = document.createElement("style");
  st.textContent = "img{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}";
  (document.head || document.documentElement).appendChild(st);
  function isImg(e) { var t = e.target; return t && t.tagName === "IMG"; }
  document.addEventListener("contextmenu", function (e) { if (isImg(e)) e.preventDefault(); });
  document.addEventListener("dragstart", function (e) { if (isImg(e)) e.preventDefault(); });
})();
