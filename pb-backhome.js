/* PataBook — दुकान के पेज पर Back (← या फ़ोन का Back) दबाने पर सीधा PataBook होमपेज खुले */
(function () {
  try {
    var st = history.state || {};
    if (!st.pbshop && !st.pbhome) { history.replaceState({ pbhome: 1 }, ""); history.pushState({ pbshop: 1 }, ""); }
    addEventListener("popstate", function (e) { if (e.state && e.state.pbhome) location.replace("index.html"); });
  } catch (_) {}
})();
