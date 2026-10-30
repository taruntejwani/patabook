/* ⭐ Rating (1–5 star): login के बाद ही; एक user की एक दुकान पर एक rating (दोबारा देने पर बदलती है) */
(function(){
  var slug=new URLSearchParams(location.search).get("slug")||"",MINE=null,LOADED=false,BUSY=false,MSG="",CSS=false;
  function en(){return window.PB&&PB.lang&&PB.lang()!=="hi";}
  function T(h,e){return en()?e:h;}
  function sb(){try{return {u:SB,k:KEY};}catch(e){return null;}}
  async function call(fn,args,tok){var c=sb();if(!c)throw new Error("no sb");
    var r=await fetch(c.u+"/rest/v1/rpc/"+fn,{method:"POST",headers:{apikey:c.k,Authorization:"Bearer "+tok,"Content-Type":"application/json"},body:JSON.stringify(args)});
    var j=null;try{j=await r.json();}catch(e){}
    if(!r.ok){var x=new Error((j&&(j.message||j.msg))||("HTTP "+r.status));x.status=r.status;throw x;}return j;}
  async function sess(){try{return window.PBA?await PBA.session():null;}catch(e){return null;}}
  async function loadMine(){if(LOADED)return;LOADED=true;var s=await sess();if(!s)return;try{var v=await call("pb_my_rating",{p_slug:slug},s.access_token);MINE=v||null;}catch(e){}paint();}
  function css(){if(CSS)return;CSS=true;var st=document.createElement("style");st.textContent=".pbrate{margin:14px 0;padding:12px 14px;border:1px solid #e3e6f0;border-radius:14px;background:#fff}.pbrate b{display:block;font-size:14px;margin-bottom:6px}.pbrate .st{display:flex;gap:6px}.pbrate .st button{font-size:30px;line-height:1;background:none;border:0;padding:2px;cursor:pointer;color:#cfd3e0}.pbrate .st button.on{color:#f5b301}.pbrate small{display:block;margin-top:6px;color:#5b6475;font-size:13px}";document.head.appendChild(st);}
  function paint(){var el=document.getElementById("pbRate");if(!el)return;css();
    var h='<b>⭐ '+(MINE?T("आपकी rating","Your rating"):T("इस दुकान को rating दें","Rate this shop"))+'</b><div class="st">';
    for(var i=1;i<=5;i++)h+='<button type="button" data-s="'+i+'" class="'+(MINE&&i<=MINE?"on":"")+'" aria-label="'+i+' star">★</button>';
    h+='</div>'+(MSG?'<small>'+MSG+'</small>':'<small>'+T("Rating के लिए login ज़रूरी है।","Login is needed to rate.")+'</small>');
    el.className="pbrate";el.innerHTML=h;}
  async function rate(n){if(BUSY)return;var s=await sess();if(!s){location.href=PBA.loginUrl();return;}
    BUSY=true;MSG="…";paint();
    try{var j=await call("pb_rate_shop",{p_slug:slug,p_stars:n},s.access_token);MINE=n;MSG=T("धन्यवाद! आपकी rating सेव हो गई।","Thanks! Your rating is saved.");
      var chips=document.querySelectorAll(".chip,.tag");for(var i=0;i<chips.length;i++){if(/★/.test(chips[i].textContent)){chips[i].textContent="★ "+j.rating+" ("+j.count+")";break;}}}
    catch(e){MSG=/own shop/i.test(e.message)?T("अपनी ही दुकान को rating नहीं दे सकते।","You cannot rate your own shop."):/login|JWT|expired/i.test(e.message)?T("दोबारा login करें।","Please log in again."):T("अभी rating सेव नहीं हो सकी।","Could not save your rating.");}
    BUSY=false;paint();}
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#pbRate button[data-s]");if(b)rate(+b.dataset.s);});
  function tick(){var el=document.getElementById("pbRate");if(el&&!el.firstChild){loadMine();paint();}}
  new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("DOMContentLoaded",tick);
  window.PBRate={paint:paint};
})();
