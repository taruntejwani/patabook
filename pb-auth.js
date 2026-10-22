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
/* email par OTP (code / link) bhejo */
async function sendOtp(email,next){
  var back=location.origin+location.pathname.replace(/[^\/]*$/,"")+"login.html"+(next?"?next="+encodeURIComponent(next):"");
  var r=await fetch(SB+"/auth/v1/otp?redirect_to="+encodeURIComponent(back),{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json",Authorization:"Bearer "+KEY},body:JSON.stringify({email:email,create_user:true})});
  if(!r.ok){var j=null;try{j=await r.json();}catch(e){}var err=new Error((j&&(j.msg||j.message||j.error_description))||("HTTP "+r.status));err.status=r.status;err.code=j&&(j.error_code||j.code);throw err;}
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
  catch(e){save(null);return null;}
}
async function logout(){var s=read();save(null);if(s){try{await call("logout",{},s.access_token);}catch(e){}}}
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
async function otpCall(path,body,withSession){
  var base=otpBase();if(!base){var e0=new Error("otp_not_configured");e0.code="otp_not_configured";throw e0;}
  var h={"Content-Type":"application/json"};
  if(withSession){var s=await session();if(!s){var e1=new Error("login_required");e1.code="login_required";e1.status=401;throw e1;}h.Authorization="Bearer "+s.access_token;}
  var r=await fetch(base+path,{method:"POST",headers:h,body:JSON.stringify(body||{}),cache:"no-store"});
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
  shopSend:function(slug,phone){return otpCall("/send",{purpose:"shop_phone",slug:slug,phone:phone},true);},
  shopVerify:function(slug,phone,code){return otpCall("/verify",{purpose:"shop_phone",slug:slug,phone:phone,code:code},true);}
};
window.PBA={sendOtp:sendOtp,verifyOtp:verifyOtp,fromUrl:fromUrl,session:session,logout:logout,contact:contact,loginUrl:loginUrl,current:read,mobile:mobile};
})();
