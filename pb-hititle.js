/* हिंदी चुनी हो तो data-hi वाले hover / aria टेक्स्ट हिंदी में (default English) */
(function(){
  function run(){var hi=false;try{hi=localStorage.getItem("pb-lang")==="hi";}catch(e){}
    if(!hi)return;
    var n=document.querySelectorAll("[data-hi]");
    for(var k=0;k<n.length;k++){var h=n[k].getAttribute("data-hi");
      if(n[k].hasAttribute("title"))n[k].setAttribute("title",h);
      if(n[k].hasAttribute("aria-label"))n[k].setAttribute("aria-label",h);}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();
