/* PataBook login: Supabase Auth (email OTP) ka seedha API. Koi alag auth system nahi.
   Session is phone ke browser me (localStorage "pb-session") rehta hai. */
(function(){
var SB="https://kkvbpzysktozghnxplxv.supabase.co";
var KEY="sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
var SK="pb-session";

function read(){try{return JSON.parse(localStorage.getItem(SK)||"null");}catch(e){return null;}}
function save(s){try{s?localStorage.setItem(SK,JSON.stringify(s)):localStorage.removeItem(SK);}catch(e){}}
function fromToken(d){
  if(!d||!d.access_token)return null;
  var exp=d.expires_at?+d.expires_at:Math.floor(Date.now()/1000)+(+d.expires_in||3600);
  return {access_token:d.access_token,refresh_token:d.refresh_token,expires_at:exp,email:(d.user&&d.user.email)||d.email||""};
}
async function call(path,body,token){
  var r=await fetch(SB+"/auth/v1/"+path,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json",Authorization:"Bearer "+(token||KEY)},body:JSON.stringify(body||{})});
  var j=null;try{j=await r.json();}catch(e){}
  if(!r.ok){var err=new Error((j&&(j.msg||j.error_description||j.message||j.error))||("HTTP "+r.status));err.status=r.status;err.code=j&&(j.error_code||j.code);throw err;}
  return j;
}
/* Guest login (Supabase Anonymous sign-in): register ke time OTP ke bina draft dukaan ke liye. OTP baad me — profile poori hone par */
async function guest(){
  var d=await call("signup",{data:{}});
  var s=fromToken(d);if(!s)throw new Error("guest login failed");
  save(s);return s;
}
function isGuest(s){
  s=s||read();if(!s||!s.access_token)return false;
  try{var p=JSON.parse(atob(s.access_token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));return p.is_anonymous===true;}catch(e){return false;}
}
/* email par OTP (code / link) bhejo */
async function sendOtp(email,next){
  var back=location.origin+location.pathname.replace(/[^\/]*$/,"")+"login.html"+(next?"?next="+encodeURIComponent(next):"");
  var r=await fetch(SB+"/auth/v1/otp?redirect_to="+encodeURIComponent(back),{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json",Authorization:"Bearer "+KEY},body:JSON.stringify({email:email,create_user:true})});
  if(!r.ok){var j=null;try{j=await r.json();}catch(e){}var err=new Error((j&&(j.msg||j.message||j.error_description))||("HTTP "+r.status));err.status=r.status;err.code=j&&(j.error_code||j.code);throw err;}
}
/* Google se login: Supabase /authorize par bhejo; wapas login.html#access_token=... aata hai (fromUrl lega).
   next ko sessionStorage me rakhte hain taaki redirect_to bina query ke allow-list se match ho */
function google(next){
  try{sessionStorage.setItem("pb-g-next",next||"");}catch(e){}
  var back=location.origin+location.pathname.replace(/[^\/]*$/,"")+"login.html";
  location.href=SB+"/auth/v1/authorize?provider=google&redirect_to="+encodeURIComponent(back);
}
function googleNext(){var n="";try{n=sessionStorage.getItem("pb-g-next")||"";sessionStorage.removeItem("pb-g-next");}catch(e){}return n;}
/* is account me kaun-kaun se login jude hain (google / mobile) */
async function identities(){
  var s=await session();if(!s)return null;
  var r=await fetch(SB+"/auth/v1/user",{headers:{apikey:KEY,Authorization:"Bearer "+s.access_token}});
  if(!r.ok)return null;var u=await r.json(),ids=u.identities||[],em=String(u.email||s.email||"");
  return {google:ids.some(function(i){return i.provider==="google";}),mobile:/^m[6-9]\d{9}@phone\.patabook\.in$/i.test(em)||!!u.phone,email:em};
}
/* login hue account me Google jodo (Supabase me "Allow manual linking" ON hona chahiye) */
async function linkGoogle(next){
  var s=await session();if(!s)throw new Error("login");
  try{sessionStorage.setItem("pb-g-next",next||"");}catch(e){}
  var back=location.origin+location.pathname.replace(/[^\/]*$/,"")+"login.html";
  var r=await fetch(SB+"/auth/v1/user/identities/authorize?provider=google&skip_http_redirect=true&redirect_to="+encodeURIComponent(back),{headers:{apikey:KEY,Authorization:"Bearer "+s.access_token}});
  var j=null;try{j=await r.json();}catch(e){}
  if(!r.ok||!j||!j.url)throw new Error((j&&(j.msg||j.message||j.error_description))||("HTTP "+r.status));
  location.href=j.url;
}
/* email me aaya code verify karo */
async function verifyOtp(email,code){
  var d;
  try{d=await call("verify",{type:"email",email:email,token:code});}
  catch(e){d=await call("verify",{type:"signup",email:email,token:code});}   /* naye user ka pehla code */
  var s=fromToken(d);if(!s)throw new Error("no session");s.email=s.email||email;save(s);return s;
}
/* email ke link se aaye to URL (#access_token=...) se session lo */
function fromUrl(){
  var h=location.hash||"";if(h.indexOf("access_token=")<0)return null;
  var p=new URLSearchParams(h.slice(1));
  var s=fromToken({access_token:p.get("access_token"),refresh_token:p.get("refresh_token"),expires_in:p.get("expires_in"),expires_at:p.get("expires_at")});
  if(s){try{var pl=JSON.parse(atob(s.access_token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));s.email=pl.email||"";}catch(e){}save(s);}
  history.replaceState(null,"",location.pathname+location.search);
  return s;
}
/* valid session (zaroorat ho to refresh) */
async function session(){
  var s=read();if(!s)return null;
  if(s.expires_at-60>Date.now()/1000)return s;
  if(!s.refresh_token){save(null);return null;}
  try{var d=await call("token?grant_type=refresh_token",{refresh_token:s.refresh_token});var n=fromToken(d);n.email=n.email||s.email;save(n);return n;}
  catch(e){if(e.status>=400&&e.status<500)save(null);return null;}   /* इंटरनेट न हो तो login मत मिटाओ */
}
/* सिर्फ इसी फ़ोन/PC से logout (scope=local) — दुकानदार के दूसरे फ़ोन का login चलता रहे */
async function logout(){var s=read();save(null);if(s){try{await call("logout?scope=local",{},s.access_token);}catch(e){}}}
/* "मेरी दुकान": यह फ़ोन/PC दर्ज करो (एक साथ 2 मोबाइल + 1 PC)। बंद हो चुका login हो तो यहाँ से भी logout। */
function devKind(){var u=navigator.userAgent||"";return /Mobi|Android|iPhone|iPad|iPod/i.test(u)?"mobile":"pc";}
function devLabel(){var u=navigator.userAgent||"";
  if(/iPhone/i.test(u))return "iPhone";if(/iPad/i.test(u))return "iPad";
  if(/Android/i.test(u)){var m=u.match(/Android[^;)]*;\s*([^;)]+?)(?:\s+Build|\))/);var n=m&&m[1]&&!/^(K|wv|Linux)$/i.test(m[1].trim())?m[1].trim():"";return ("Android "+n).trim().slice(0,40);}
  if(/Windows/i.test(u))return "Windows PC";if(/Macintosh|Mac OS/i.test(u))return "Mac";if(/CrOS/i.test(u))return "Chromebook";if(/Linux/i.test(u))return "Linux PC";return "";}
async function deviceCheck(){
  var s=await session();if(!s)return {ok:false,reason:"login"};
  var r=await fetch(SB+"/rest/v1/rpc/pb_my_device_check",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+s.access_token,"Content-Type":"application/json"},body:JSON.stringify({p_kind:devKind(),p_label:devLabel()})});
  if(r.status===404)return {ok:true,tracked:false};   /* sql-18 अभी नहीं चली */
  var j=null;try{j=await r.json();}catch(e){}
  if(r.status===401||r.status===403){save(null);return {ok:false,reason:"login"};}
  if(!r.ok||!j)return {ok:true,tracked:false};        /* जाँच न हो पाए तो दुकानदार को बाहर मत करो */
  if(j.ok===false){save(null);try{sessionStorage.setItem("pb-kicked",j.reason||"limit");}catch(e){}}
  return j;
}
async function deviceKick(id){
  var s=await session();if(!s)throw new Error("login");
  var r=await fetch(SB+"/rest/v1/rpc/pb_my_device_kick",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+s.access_token,"Content-Type":"application/json"},body:JSON.stringify({p_sid:id})});
  if(!r.ok)throw new Error("HTTP "+r.status);return true;
}
/* login ke baad hi number: database function pb_contact (sirf logged-in user) */
async function contact(slug){
  var s=await session();if(!s){var e0=new Error("login");e0.status=401;throw e0;}
  var r=await fetch(SB+"/rest/v1/rpc/pb_contact",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+s.access_token,"Content-Type":"application/json"},body:JSON.stringify({p_slug:slug})});
  var j=null;try{j=await r.json();}catch(e){}
  if(!r.ok){var err=new Error((j&&(j.message||j.msg))||("HTTP "+r.status));err.status=r.status;err.code=j&&j.code;throw err;}
  return Array.isArray(j)?j[0]||null:j;
}
function loginUrl(next){return "login.html?next="+encodeURIComponent(next||(location.pathname.split("/").pop()+location.search));}

/* ---- Mobile OTP (Fast2SMS Worker) — v47 OTP add-on. Purana email login bilkul waisa hi hai. ----
   Worker sirf OTP check karta hai. Session Supabase khud deta hai (token_hash verify),
   aur admin hai ya nahi, yeh Supabase ke pb_admins / admin functions hi tay karte hain. */
function otpBase(){return String((window.PB_SITE&&window.PB_SITE.otpUrl)||"").replace(/\/$/,"");}
/* "मैं रोबोट नहीं हूँ" जाँच (Cloudflare Turnstile) — site-config.js में turnstileKey हो तभी चलती है.
   ज़्यादातर लोगों को कुछ दिखता भी नहीं; शक होने पर ही एक छोटा box आता है. */
/* key हर बार ताज़ा पढ़ो — कुछ पेजों में site-config.js इस फाइल के बाद load होती है (मेरी दुकान में यही गड़बड़ थी) */
function tsKey(){return String((window.PB_SITE&&window.PB_SITE.turnstileKey)||"");}
var tsWid=null,tsWait=null,tsLoad=null;
function tsScript(){
  if(window.turnstile)return Promise.resolve();
  if(tsLoad)return tsLoad;
  tsLoad=new Promise(function(res,rej){var sc=document.createElement("script");
    sc.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";sc.async=true;
    sc.onload=function(){res();};sc.onerror=function(){tsLoad=null;rej(new Error("captcha_failed"));};
    document.head.appendChild(sc);});
  return tsLoad;
}
var tsMode=null;
function tsLang(){var lg="en";try{if(localStorage.getItem("pb-lang")==="hi")lg="hi";}catch(e){}return lg;}
function tsHint(box,on){
  var h=document.getElementById("pbCapHint");
  if(!on){if(h&&h.parentNode)h.parentNode.removeChild(h);return;}
  if(!h){h=document.createElement("div");h.id="pbCapHint";h.style.cssText="text-align:center;font-size:13px;font-weight:700;color:#b45309;margin:8px 0 2px";box.parentNode.insertBefore(h,box);}
  h.textContent=tsLang()==="hi"?"नीचे \u201cमैं रोबोट नहीं हूँ\u201d जाँच पूरी होने दें — OTP अपने-आप चला जाएगा।":"Let the \u201cI am not a robot\u201d check below finish — your OTP will be sent automatically.";
}
/* पहले चुपचाप जाँच; फेल हो तो साफ़ दिखने वाला box अपने-आप आता है और पास होते ही OTP चल पड़ता है (दोबारा tap नहीं) */
function tsRender(box,mode){
  if(tsWid!==null){try{window.turnstile.remove(tsWid);}catch(e){}tsWid=null;}
  box.innerHTML="";tsMode=mode;
  var vis=mode==="vis";
  tsWid=window.turnstile.render(box,{sitekey:tsKey(),execution:vis?"render":"execute",appearance:vis?"always":"interaction-only",language:tsLang(),
    callback:function(t){tsHint(box,false);var p=tsWait;tsWait=null;if(p)p.res(t);},
    "error-callback":function(){tsFail(box);},"timeout-callback":function(){tsFail(box);}});
}
function tsFail(box){
  if(!tsWait)return;
  if(tsMode!=="vis"){setTimeout(function(){if(!tsWait)return;tsHint(box,true);try{tsRender(box,"vis");}catch(e){tsReject();}},0);return;}
  tsReject();
}
function tsReject(){var p=tsWait;tsWait=null;var b=document.getElementById("pbCaptcha");tsHint(b,false);if(p){var e2=new Error("captcha_failed");e2.code="captcha_failed";p.rej(e2);}}
async function captchaToken(anchor){
  if(!tsKey())return "";
  try{await tsScript();}catch(e){var e1=new Error("captcha_failed");e1.code="captcha_failed";throw e1;}
  return new Promise(function(res,rej){
    var box=document.getElementById("pbCaptcha");
    if(!box){box=document.createElement("div");box.id="pbCaptcha";box.style.cssText="display:flex;justify-content:center;margin:10px 0";
      if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(box,anchor.nextSibling);else document.body.appendChild(box);}
    tsWait={res:res,rej:rej};
    if(tsWid===null||tsMode===null){tsRender(box,"auto");window.turnstile.execute(tsWid);}
    else{try{window.turnstile.reset(tsWid);}catch(e){}if(tsMode!=="vis")window.turnstile.execute(tsWid);}
    setTimeout(function(){if(tsWait&&tsWait.res===res)tsReject();},90000);
  });
}
async function otpCall(path,body,withSession){
  var base=otpBase();if(!base){var e0=new Error("otp_not_configured");e0.code="otp_not_configured";throw e0;}
  var h={"Content-Type":"application/json"};
  if(withSession){var s=await session();if(!s){var e1=new Error("login_required");e1.code="login_required";e1.status=401;throw e1;}h.Authorization="Bearer "+s.access_token;}
  body=body||{};if(path==="/send"&&tsKey())body.ts=await captchaToken(document.activeElement);
  var r=await fetch(base+path,{method:"POST",headers:h,body:JSON.stringify(body),cache:"no-store"});
  var j=null;try{j=await r.json();}catch(e){}
  if(!r.ok||!j||!j.ok){var err=new Error((j&&j.error)||("HTTP "+r.status));err.status=r.status;err.code=(j&&j.error)||"";err.retry_after=j&&j.retry_after;err.attempts_left=j&&j.attempts_left;throw err;}
  return j;
}
/* Worker se mila one-time token_hash Supabase ko dekar asli session lo */
async function verifyTokenHash(tokenHash,email){
  var d;
  try{d=await call("verify",{type:"email",token_hash:tokenHash});}
  catch(e){d=await call("verify",{type:"magiclink",token_hash:tokenHash});}   /* purane Auth version ke liye */
  var s=fromToken(d);if(!s)throw new Error("no session");s.email=s.email||email||"";save(s);return s;
}
var mobile={
  enabled:function(){return !!otpBase();},
  adminSend:function(phone){return otpCall("/send",{purpose:"admin_login",phone:phone},false);},
  adminVerify:async function(phone,code){var j=await otpCall("/verify",{purpose:"admin_login",phone:phone,code:code},false);return verifyTokenHash(j.token_hash,j.email);},
  /* टीम (Manager / Staff): Admin ने जिस नंबर को टीम में जोड़ा है, उसी नंबर + OTP से login */
  teamSend:function(phone){return otpCall("/send",{purpose:"team_login",phone:phone},false);},
  teamVerify:async function(phone,code){var j=await otpCall("/verify",{purpose:"team_login",phone:phone,code:code},false);return verifyTokenHash(j.token_hash,j.email);},
  /* "मेरी दुकान": जिस नंबर से दुकान जोड़ी, उसी नंबर + OTP से login (email ज़रूरी नहीं) */
  ownerSend:function(phone){return otpCall("/send",{purpose:"owner_login",phone:phone},false);},
  /* मोबाइल नंबर + 6 अंकों का PIN (SMS नहीं) */
  pinLogin:async function(phone,pin){var j=await otpCall("/owner/pin/login",{phone:phone,pin:pin},false);return verifyTokenHash(j.token_hash,j.email);},
  pinStatus:function(){return otpCall("/owner/pin/status",{},true);},
  pinSet:function(pin){return otpCall("/owner/pin/set",{pin:pin},true);},
  /* "दुकान जोड़ें" में पहले से जुड़ा नंबर: Worker ने सीधे login का token दिया */
  useTokenHash:function(th,email){return verifyTokenHash(th,email);},
  ownerVerify:async function(phone,code){var j=await otpCall("/verify",{purpose:"owner_login",phone:phone,code:code},false);return verifyTokenHash(j.token_hash,j.email);},
  shopSend:function(slug,phone){return otpCall("/send",{purpose:"shop_phone",slug:slug,phone:phone},true);},
  shopVerify:function(slug,phone,code){return otpCall("/verify",{purpose:"shop_phone",slug:slug,phone:phone,code:code},true);},
  /* दुकान / staff का Call-WhatsApp नंबर: OTP से पक्का (login नहीं बदलता) */
  staffSend:function(slug,phone){return otpCall("/send",{purpose:"staff_phone",slug:slug,phone:phone},true);},
  staffVerify:function(slug,phone,code){return otpCall("/verify",{purpose:"staff_phone",slug:slug,phone:phone,code:code},true);}

};
window.PBA={guest:guest,isGuest:isGuest,identities:identities,linkGoogle:linkGoogle,google:google,googleNext:googleNext,otp:function(path,body){return otpCall(path,body,false);},captchaToken:captchaToken,sendOtp:sendOtp,verifyOtp:verifyOtp,fromUrl:fromUrl,session:session,logout:logout,contact:contact,loginUrl:loginUrl,current:read,mobile:mobile,deviceCheck:deviceCheck,deviceKick:deviceKick};
})();
