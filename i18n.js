/* PataBook – bhasha (language) system.
   English + Hindi yahin hai. Baaki 22 bhashayen lang/<code>.js me hain aur sirf chunne par load hoti hain.
   Browser / Google translate band hai (translate="no"). */
(function(){
var LANGS=[   /* ज़्यादा इस्तेमाल होने वाली भाषाएँ + सिन्धी (देवनागरी) */
 ["en","English","English"],["hi","हिन्दी","Hindi"],
 ["sd-deva","सिन्धी (देवनागरी)","Sindhi (Devanagari)"],
 ["gu","ગુજરાતી","Gujarati"],["mr","मराठी","Marathi"],["bn","বাংলা","Bengali"],["ta","தமிழ்","Tamil"],
 ["te","తెలుగు","Telugu"]
];
var RTL={ur:1,sd:1,ks:1};
var FONTS={sat:"Noto+Sans+Ol+Chiki",mni:"Noto+Sans+Meetei+Mayek"};

var D={
en:{
lang:"Language",
search:"Search",ph:"What are you looking for?",loading:"Searching...",none:"No business found.",fail:"Search failed",net:"Network error",
joinq:"Is your business on PataBook?",joinbtn:"Add your business",allcats:"All Categories",qc_h:"Choose a category",myshop:"My Shop",myshop_btn:"Open My Shop",myshop_bar:"My Shop",myshop_sub:"You are logged in — manage your shop",
c_Automobile:"Automobile",c_Food:"Food",c_Health:"Health",c_Shopping:"Shopping",c_Education:"Education",c_Home:"Home Services",c_Professional:"Professional",c_Hotel:"Hotel",
addshop:"List your shop",near:"Shops near you",within:"within {r}",all:"All",found:"{n} shops found",nearest:"nearest first",
locating:"Finding your location…",using:"📍 From your location",denied:"Location unavailable — choose a city:",retry:"Try again",
call:"Call",dir:"Directions",details:"Details",away:"away",cnone:"No shops found in this range yet.",wider:"Widen range",
add:"Add your shop",addq:"Is your shop here? Add it to PataBook for FREE.",err:"Could not load. Check your connection and retry.",ver:"✓ Verified",range:"Range",
b_back:"← Back to PataBook",b_loading:"Loading…",b_nf:"Business not found",b_noslug:"This link is incomplete.",b_na:"This listing is not available.",
b_def:"Details of this business are available on PataBook.",b_conn:"Connection problem",b_connmsg:"Business details could not load right now.",b_map:"Map",b_web:"Website",
back:"← Back",q_n:"Question {a} / {b}",
shop_h:"What is the name of your shop / business?",shop_hint:"Write it the way it is written on the board.",shop_ph:"e.g. Shri Krishna Car Wash",
owner_h:"What is your name?",owner_hint:"Name of the shop owner or manager.",owner_hint_n:"Name of the owner or manager of “{n}”.",owner_ph:"Your full name",
loc_h:"Add the shop location on the map",loc_hint:"With a location, your shop goes live on PataBook right away. Without it, it goes live after a check. If you are at the shop, press the button.",
gps:"📍 Add my current location",or:"— or —",maplbl:"Paste a Google Maps link",opt:"(optional)",
addr_h:"Write the shop address",addr_hint:"With shop number, street / road and landmark.",city_l:"City / Village *",area_l:"Locality / Area",addr_l:"Full address *",addr_ph:"Shop number, road, landmark...",
svc_h:"What work do you do / what do you sell?",svc_hint:"This helps PataBook pick the right category for you.",svc_ph:"e.g. car wash, polish, interior cleaning",
phone_h:"What is your mobile number?",phone_hint:"Customers will call / WhatsApp you on this number.",
prev:"← Back",skip:"Skip",next:"Next →",submit:"✅ Submit",sending:"Sending...",thanks:"Thank you!",openpb:"Open PataBook",
sheet_t:"Choose category",sq_ph:"Search: e.g. plumber, school, clothes",cat_find:"Finding category…",cat_auto:"✅ Category picked automatically",cat_mine:"✅ Your category",
change:"Change",cat_none:"Category not decided yet.",cat_none2:"Write your work above, or choose it yourself.",choose:"Choose",
o_row:"➕ Other",o_sub:"My work is not in the list",failmsg:"The list is not opening right now. Check your internet, or write your work in Other below.",
o_hint:"Your work is not in the list? Write its name. It will be saved in PataBook so nobody has to add it again.",o_name:"Name of your business / work *",o_name_ph:"e.g. Tent House",
o_main:"Which main category does it come under?",o_opt:"Other",o_save:"✅ Save and choose",o_err:"Write a correct name of 3 to 60 letters (no link).",
nocat:"No category found for “{q}”.",o_addq:"Add “{q}” to Other",sugg:"✨ Suggestions for your work",back_all:"← All Categories",types:"{n} types",
o_incat:"Add your work in this category",o_ingrp:"Add your work in this group",
e_shop:"Write the shop name.",e_owner:"Write your name.",e_map:"This does not look like a Google Maps link. Fix the link or leave it empty.",
e_city:"Write the city / village name.",e_addr:"Write the full address.",e_phone:"Enter a correct 10-digit mobile number.",
s_shop:"Shop",s_name:"Name",s_city:"City",s_map:"Map",s_cat:"Category",map_ok:"✅ Added",map_no:"— Not added",cat_pb:"PataBook will decide",
g_nogeo:"Location is not available on this phone. Enter a Google Maps link.",g_find:"Finding location...",g_ok:"✅ Location added.",g_see:"View on map",g_again:"📍 Take location again",
g_err:"Location not found. Turn on phone location and browser permission, or enter a Google Maps link.",
d_live:"{name} is now live.",d_open:"Open your listing",d_free:"Listing is free.",d_got:"Request for {name} received.",
d_policy:"Location was added, but the live policy is not in Supabase yet. Run the SQL, otherwise it goes live after a check.",
d_noloc:"There was no location, so the listing will start after a check.",send_err:"Request could not be sent ({e}). Please try again after a while.",
app_s:"Use it like an app on your phone",app_b:"Install",app_ios:"On iPhone: tap the Share button (⬆) at the bottom of Safari, then choose “Add to Home Screen”.",app_gen:"Open the browser menu (⋮) and tap “Install app” or “Add to Home screen”.",app_ok:"OK",
s_all:"All places",s_hint:"Search by business name, category, city, village or PIN code",s_for:"Results for “{q}”",s_none:"No business found for “{q}”.",s_tip:"Try a shorter word, check the spelling, or choose “All places”.",s_empty:"Type a business name, category, city or PIN code to search.",
lock_ph:"🔒 Log in to see the mobile number",lock_wa:"🔒 Log in to see the WhatsApp number",lock_short:"🔒 Log in to see number",c_title:"Contact",c_limit:"You have seen many numbers today. Please try again tomorrow.",c_setup:"Contact numbers are not available right now. Please try again later.",c_none:"No number added for this business.",i_area:"Area",i_addr:"Address",i_svc:"Products / Services",l_title:"Log in",l_sub:"Enter your email. We will send you a login code.",l_email:"Email",l_send:"Send code",l_sent:"We sent a code to {e}. Check your inbox (and Spam).",l_code:"Enter the code",l_verify:"Verify & continue",l_resend:"Resend code",l_change:"Change email",l_bad_email:"Enter a correct email address.",l_bad_code:"Wrong or expired code. Check and try again.",l_wait:"Too many tries. Please wait a minute and try again.",l_in:"Logged in as {e}",l_out:"Logout",l_back:"Continue",
e_cat:"Please choose your business category.",e_catid:"Category could not be confirmed, so the shop was not submitted. Please try again in a little while.",g_whole:"None of these? Choose “{g}”"
},
hi:{
lang:"भाषा",
search:"खोजें",ph:"क्या ढूंढ रहे हैं?",loading:"खोज रहे हैं...",none:"कोई बिज़नेस नहीं मिला।",fail:"खोज रुक गई",net:"नेटवर्क त्रुटि",
joinq:"क्या आपने अपना बिज़नेस PataBook पर जोड़ा?",joinbtn:"अपना बिज़नेस जोड़ें",allcats:"सभी कैटेगरी",qc_h:"कैटेगरी चुनें",myshop:"मेरी दुकान",myshop_btn:"मेरी दुकान खोलें",myshop_bar:"मेरी दुकान",myshop_sub:"आप लॉगिन हैं — अपनी दुकान संभालें",
c_Automobile:"ऑटोमोबाइल",c_Food:"खाना",c_Health:"स्वास्थ्य",c_Shopping:"शॉपिंग",c_Education:"शिक्षा",c_Home:"होम सर्विस",c_Professional:"प्रोफेशनल",c_Hotel:"होटल",
addshop:"दुकान जोड़ें",near:"आपके पास की दुकानें",within:"{r} के अंदर",all:"सभी",found:"{n} दुकानें मिलीं",nearest:"सबसे पास से शुरू",
locating:"आपकी location ढूंढ रहे हैं…",using:"📍 आपकी location से",denied:"Location नहीं मिली — शहर चुनें:",retry:"फिर कोशिश करें",
call:"Call करें",dir:"रास्ता",details:"पूरी जानकारी",away:"दूर",cnone:"इस दायरे में अभी कोई दुकान नहीं मिली।",wider:"दायरा बढ़ाएँ",
add:"अपनी दुकान जोड़ें",addq:"क्या आपकी दुकान यहाँ है? PataBook पर FREE जोड़ें।",err:"लोड नहीं हो सका। इंटरनेट जाँचकर फिर कोशिश करें।",ver:"✓ Verified",range:"दायरा",
b_back:"← PataBook पर वापस",b_loading:"लोड हो रहा है…",b_nf:"Business नहीं मिला",b_noslug:"यह link अधूरा है।",b_na:"यह listing उपलब्ध नहीं है।",
b_def:"PataBook पर इस business की जानकारी उपलब्ध है।",b_conn:"Connection problem",b_connmsg:"Business details अभी load नहीं हो सके।",b_map:"Map",b_web:"Website",
back:"← वापस",q_n:"सवाल {a} / {b}",
shop_h:"आपकी दुकान / बिज़नेस का नाम क्या है?",shop_hint:"जैसा बोर्ड पर लिखा है, वैसा लिखें।",shop_ph:"जैसे: श्री कृष्णा कार वॉश",
owner_h:"आपका नाम क्या है?",owner_hint:"दुकान के मालिक या संचालक का नाम।",owner_hint_n:"“{n}” के मालिक या संचालक का नाम।",owner_ph:"आपका पूरा नाम",
loc_h:"दुकान की location map पर जोड़ें",loc_hint:"Location जोड़ोगे तो दुकान तुरंत PataBook पर live हो जाएगी। बिना location के जाँच के बाद चलेगी। दुकान पर हों तो बटन दबाएँ।",
gps:"📍 मेरी अभी की location जोड़ें",or:"— या —",maplbl:"Google Maps का link चिपकाएँ",opt:"(वैकल्पिक)",
addr_h:"दुकान का पता लिखें",addr_hint:"दुकान नंबर, गली / रोड, लैंडमार्क के साथ।",city_l:"शहर / गाँव *",area_l:"इलाका / Area",addr_l:"पूरा पता *",addr_ph:"दुकान नंबर, रोड, लैंडमार्क...",
svc_h:"आप क्या काम / सामान बेचते हैं?",svc_hint:"इससे PataBook आपकी सही category खुद चुन लेगा।",svc_ph:"जैसे: car wash, polish, interior cleaning",
phone_h:"आपका मोबाइल नंबर क्या है?",phone_hint:"ग्राहक इसी नंबर पर call / WhatsApp करेंगे।",
prev:"← पीछे",skip:"छोड़ें",next:"आगे →",submit:"✅ जमा करें",sending:"भेज रहे हैं...",thanks:"धन्यवाद!",openpb:"PataBook खोलें",
sheet_t:"Category चुनें",sq_ph:"खोजें: जैसे plumber, school, कपड़े",cat_find:"category ढूँढ रहे हैं…",cat_auto:"✅ अपने-आप चुनी गई category",cat_mine:"✅ आपकी category",
change:"बदलें",cat_none:"अभी category तय नहीं हुई।",cat_none2:"ऊपर काम लिखें, या खुद चुनें।",choose:"चुनें",
o_row:"➕ Other / अन्य",o_sub:"मेरा काम लिस्ट में नहीं है",failmsg:"लिस्ट अभी नहीं खुल रही। इंटरनेट जाँचें, या नीचे Other में अपना काम लिखें।",
o_hint:"आपका काम लिस्ट में नहीं है? नाम लिखें। इसे PataBook में सेव कर लिया जाएगा, ताकि अगली बार किसी को दोबारा न जोड़ना पड़े।",o_name:"आपके बिज़नेस / काम का नाम *",o_name_ph:"जैसे: Tent House",
o_main:"यह किस बड़ी category में आता है?",o_opt:"Other / अन्य",o_save:"✅ सेव करके चुनें",o_err:"3 से 60 अक्षर का सही नाम लिखें (link नहीं)।",
nocat:"“{q}” से कोई category नहीं मिली।",o_addq:"“{q}” को Other में जोड़ें",sugg:"✨ आपके काम के हिसाब से सुझाव",back_all:"← सभी Category",types:"{n} प्रकार",
o_incat:"इसी category में अपना काम जोड़ें",o_ingrp:"इस group में अपना काम जोड़ें",
e_shop:"दुकान का नाम लिखें।",e_owner:"अपना नाम लिखें।",e_map:"यह Google Maps का link नहीं लग रहा। link ठीक करें या छोड़ दें।",
e_city:"शहर / गाँव का नाम लिखें।",e_addr:"पूरा पता लिखें।",e_phone:"सही 10 अंकों का mobile number डालें।",
s_shop:"दुकान",s_name:"नाम",s_city:"शहर",s_map:"Map",s_cat:"Category",map_ok:"✅ जुड़ गया",map_no:"— नहीं जोड़ा",cat_pb:"PataBook तय करेगा",
g_nogeo:"इस फ़ोन में location नहीं मिल रही। Google Maps link डालें।",g_find:"location ढूँढ रहे हैं...",g_ok:"✅ Location जुड़ गई।",g_see:"Map पर देखें",g_again:"📍 Location फिर से लें",
g_err:"Location नहीं मिली। फ़ोन में location और browser की permission चालू करें, या Google Maps link डालें।",
d_live:"{name} live हो गई।",d_open:"अपनी listing खोलें",d_free:"Listing मुफ़्त है।",d_got:"{name} का अनुरोध मिल गया।",
d_policy:"Location थी, पर live policy अभी Supabase में नहीं है। SQL चलाएँ, वरना जाँच के बाद चलेगी।",
d_noloc:"Location नहीं थी, इसलिए जाँच के बाद listing चालू होगी।",send_err:"अनुरोध नहीं जा सका ({e})। थोड़ी देर बाद फिर कोशिश करें।",
app_s:"फ़ोन में ऐप की तरह इस्तेमाल करें",app_b:"इंस्टॉल करें",app_ios:"iPhone में: Safari में नीचे Share बटन (⬆) दबाएँ, फिर “Add to Home Screen” चुनें।",app_gen:"Browser का menu (⋮) खोलें और “Install app” या “Add to Home screen” दबाएँ।",app_ok:"ठीक है",
s_all:"सभी जगह",s_hint:"बिज़नेस का नाम, कैटेगरी, शहर, गाँव या PIN code से खोजें",s_for:"“{q}” के नतीजे",s_none:"“{q}” के लिए कोई बिज़नेस नहीं मिला।",s_tip:"छोटा शब्द लिखें, spelling जाँचें, या “सभी जगह” चुनें।",s_empty:"खोजने के लिए बिज़नेस का नाम, कैटेगरी, शहर या PIN code लिखें।",
lock_ph:"🔒 लॉगिन करें और मोबाइल नंबर देखें",lock_wa:"🔒 लॉगिन करें और WhatsApp नंबर देखें",lock_short:"🔒 नंबर देखने के लिए लॉगिन करें",c_title:"संपर्क",c_limit:"आज आपने बहुत नंबर देख लिए। कृपया कल फिर कोशिश करें।",c_setup:"संपर्क नंबर अभी उपलब्ध नहीं हैं। थोड़ी देर बाद फिर कोशिश करें।",c_none:"इस बिज़नेस का नंबर नहीं जोड़ा गया।",i_area:"इलाका",i_addr:"पता",i_svc:"सामान / सेवाएँ",l_title:"लॉगिन करें",l_sub:"अपना email डालें। हम आपको login code भेजेंगे।",l_email:"Email",l_send:"Code भेजें",l_sent:"{e} पर code भेजा है। Inbox (और Spam) देखें।",l_code:"Code डालें",l_verify:"Verify करें और आगे बढ़ें",l_resend:"Code फिर भेजें",l_change:"Email बदलें",l_bad_email:"सही email डालें।",l_bad_code:"Code गलत है या पुराना हो गया। जाँचकर फिर डालें।",l_wait:"बहुत बार कोशिश हुई। एक मिनट रुककर फिर करें।",l_in:"{e} से लॉगिन हैं",l_out:"Logout",l_back:"आगे बढ़ें",
e_cat:"कृपया अपने बिज़नेस की category चुनें।",e_catid:"Category की पुष्टि नहीं हो सकी, इसलिए दुकान जमा नहीं हुई। थोड़ी देर बाद फिर कोशिश करें।",g_whole:"इनमें से कोई नहीं? “{g}” चुनें"
}
};

function known(c){for(var k=0;k<LANGS.length;k++)if(LANGS[k][0]===c)return true;return false;}
var cur=null;try{cur=localStorage.getItem("pb-lang");}catch(e){}
if(!known(cur)){   /* हटाई गई भाषा पहले चुनी थी: देवनागरी वाली → हिन्दी, बाकी → English */
  var dv={mai:1,ne:1,kok:1,doi:1,brx:1,sa:1};cur=dv[cur]?"hi":"en";try{localStorage.setItem("pb-lang",cur);}catch(e){}
}

var html=document.documentElement;
html.setAttribute("translate","no");
html.classList.add("notranslate");
var TAG={"sd-deva":"sd-Deva"};
function setDoc(){html.lang=TAG[cur]||cur;html.dir=RTL[cur]?"rtl":"ltr";}
setDoc();
(function(){var m=document.createElement("meta");m.name="google";m.content="notranslate";document.head.appendChild(m);})();

var BASE=(function(){var s=document.currentScript;return (s&&s.src)?s.src.split("?")[0].replace(/[^\/]*$/,""):"";})();
function file(c){return BASE+"lang/"+c+".js?v=1";}
function font(c){
  if(!FONTS[c]||document.getElementById("pbf-"+c))return;
  var l=document.createElement("link");l.id="pbf-"+c;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family="+FONTS[c]+"&display=swap";document.head.appendChild(l);
}
window.PB_L=function(code,dict){D[code]=dict;};
/* pehli baar: language file ko parser-blocking load karo taaki page seedha usi bhasha me khule */
if(!D[cur]){document.write('<script src="'+file(cur)+'"><\/script>');}
font(cur);

function t(k,v){
  var s=D[cur]&&D[cur][k];
  if(s==null&&cur!=="en")s=D.hi[k];   /* दूसरी भाषा में न हो तो हिन्दी — pb-xl.js उसे बदल देता है */
  if(s==null)s=D.en[k];
  if(s==null)return k;
  if(v)s=s.replace(/\{(\w+)\}/g,function(m,x){return v[x]!=null?v[x]:m;});
  return s;
}
function apply(root){
  root=root||document;
  root.querySelectorAll("[data-i]").forEach(function(el){el.textContent=t(el.getAttribute("data-i"));});
  root.querySelectorAll("[data-ip]").forEach(function(el){el.placeholder=t(el.getAttribute("data-ip"));});
  var b=document.getElementById("pblBtnTxt");if(b)b.textContent=nameOf(cur);
  biApply(root);
}
/* दो-भाषा वाले attributes: data-en-t / data-hi-t (text), -title, -al (aria-label), -ph (placeholder).
   जो भाषा नहीं लिखी, उसके लिए HTML में लिखा मूल text रहता है। English चुनी → English, बाकी सब → हिन्दी। */
var BI=[["t",null],["title","title"],["al","aria-label"],["ph","placeholder"]];
function biApply(root){
  var en=cur==="en";
  BI.forEach(function(x){
    var k=x[0],at=x[1];
    root.querySelectorAll("[data-en-"+k+"],[data-hi-"+k+"]").forEach(function(el){
      var get=function(){return at?el.getAttribute(at)||"":el.textContent;};
      if(!el.hasAttribute("data-en-"+k))el.setAttribute("data-en-"+k,get());
      if(!el.hasAttribute("data-hi-"+k))el.setAttribute("data-hi-"+k,get());
      var v=el.getAttribute((en?"data-en-":"data-hi-")+k);
      if(at)el.setAttribute(at,v);else el.textContent=v;
    });
  });
  var tt=document.querySelector("title[data-en-t],title[data-hi-t]");if(tt)document.title=tt.textContent;
}
function nameOf(c){for(var k=0;k<LANGS.length;k++)if(LANGS[k][0]===c)return LANGS[k][1];return c;}

var subs=[];
function load(c,cb){
  if(D[c])return cb();
  var s=document.createElement("script");s.src=file(c);
  s.onload=function(){cb();};s.onerror=function(){cb();};
  document.head.appendChild(s);
}
function set(c){
  if(!known(c))return;
  load(c,function(){
    cur=c;try{localStorage.setItem("pb-lang",c);}catch(e){}
    setDoc();font(c);apply();appText();
    try{document.dispatchEvent(new CustomEvent("pb-lang",{detail:c}));}catch(e){}
    if(subs.length)subs.forEach(function(f){try{f(c);}catch(e){}});
    else location.reload();
  });
}

/* ---- chhota sa bhasha button (▾) ---- */
var css=".pbl{position:relative;display:inline-block;font-family:inherit}"+
".pbl-b{display:inline-flex;align-items:center;gap:6px;border:1px solid #dfe5f1;background:#fff;color:#0b2f73;border-radius:999px;padding:6px 11px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;line-height:1.2;white-space:nowrap}"+
".pbl-b svg{width:14px;height:14px;flex:none}.pbl-b i{font-style:normal;font-size:10px;opacity:.7}"+
".pbl-p{position:absolute;top:calc(100% + 6px);inset-inline-end:0;width:230px;max-height:62vh;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #e4eaf5;border-radius:14px;box-shadow:0 10px 30px rgba(11,47,115,.18);padding:6px;z-index:999;display:none;text-align:start}"+
".pbl.on .pbl-p{display:block}"+
".pbl-p button{display:flex;width:100%;justify-content:space-between;align-items:center;gap:8px;border:0;background:none;padding:9px 10px;border-radius:9px;font:inherit;font-size:15px;color:#12141c;cursor:pointer;text-align:start}"+
".pbl-p button:hover{background:#f1f6ff}.pbl-p button.on{background:#e8f1ff;color:#0b2f73;font-weight:700}"+
".pbl-p small{font-size:11px;color:#7a8396;font-weight:400}.pbl-p hr{border:0;border-top:1px solid #eef1f6;margin:4px 6px}"+
"html[lang=sat] body{font-family:'Noto Sans Ol Chiki',system-ui,sans-serif}html[lang=mni] body{font-family:'Noto Sans Meetei Mayek',system-ui,sans-serif}";
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

/* ---- visitor ke rajya (state) ki bhasha ---- */
var STATE_LANG={GJ:"gu",DH:"gu",DN:"gu",DD:"gu",MH:"mr",WB:"bn",TR:"bn",AN:"bn",TN:"ta",PY:"ta",AP:"te",TG:"te",TS:"te",KA:"kn",KL:"ml",LD:"ml",
 OR:"or",OD:"or",AS:"as",PB:"pa",CH:"pa",JK:"ks",GA:"kok",MN:"mni",SK:"ne",BR:"mai",JH:"sat"};
var STATE_NAME={gujarat:"GJ",maharashtra:"MH","west bengal":"WB",tripura:"TR",andaman:"AN","tamil nadu":"TN",puducherry:"PY",pondicherry:"PY",
 "andhra pradesh":"AP",telangana:"TG",karnataka:"KA",kerala:"KL",lakshadweep:"LD",odisha:"OR",orissa:"OR",assam:"AS",punjab:"PB",chandigarh:"CH",
 "jammu and kashmir":"JK",kashmir:"JK",goa:"GA",manipur:"MN",sikkim:"SK",bihar:"BR",jharkhand:"JH",dadra:"DH",daman:"DH"};
function codeOf(code,name){
  code=String(code||"").toUpperCase().replace(/^IN-/,"");
  if(STATE_LANG[code])return code;
  name=String(name||"").toLowerCase();
  for(var k in STATE_NAME)if(name.indexOf(k)>=0)return STATE_NAME[k];
  return code;
}
var regionLang=null;
function setRegion(code){var l=STATE_LANG[code];regionLang=(l&&known(l))?l:null;}
(function(){
  var q=null;try{q=new URLSearchParams(location.search).get("pbregion");}catch(e){}
  if(q){setRegion(codeOf(q));return;}               /* test: ?pbregion=PB */
  var c=null;try{c=JSON.parse(localStorage.getItem("pb-region")||"null");}catch(e){}
  if(c&&c.t&&Date.now()-c.t<7*864e5){setRegion(c.c);return;}
  if(!window.fetch)return;
  /* Static site: browser khud IP se rajya poochhta hai (pehle geojs.io, na mile to ipapi.co). 7 din yaad. */
  function save(code){try{localStorage.setItem("pb-region",JSON.stringify({c:code,t:Date.now()}));}catch(e){}setRegion(code);}
  function get(u){return fetch(u,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json();});}
  get("https://get.geojs.io/v1/ip/geo.json").then(function(d){
    save(d.country_code&&d.country_code!=="IN"?"":codeOf("",d.region));
  }).catch(function(){
    return get("https://ipapi.co/json/").then(function(d){
      save(d.country_code&&d.country_code!=="IN"?"":codeOf(d.region_code,d.region));
    });
  }).catch(function(){});
})();
function btnHTML(code){
  var L=null;for(var k=0;k<LANGS.length;k++)if(LANGS[k][0]===code)L=LANGS[k];
  return '<button type="button" data-l="'+L[0]+'"'+(L[0]===cur?' class="on"':'')+' lang="'+(TAG[L[0]]||L[0])+'"><span>'+L[1]+'</span><small>'+L[2]+'</small></button>';
}
function listHTML(){
  /* English, Hindi | rajya ki bhasha, Sindhi (Devanagari) | baaki sab */
  var top=["en","hi"],mid=[];
  if(regionLang&&top.indexOf(regionLang)<0&&regionLang!=="sd-deva")mid.push(regionLang);
  mid.push("sd-deva");
  var used=top.concat(mid);
  var rest=LANGS.map(function(L){return L[0];}).filter(function(c){return used.indexOf(c)<0;});
  return top.map(btnHTML).join("")+"<hr>"+mid.map(btnHTML).join("")+"<hr>"+rest.map(btnHTML).join("");
}
function mount(el){
  if(!el)return;
  el.className=(el.className?el.className+" ":"")+"pbl";
  var list=listHTML();
  el.innerHTML='<button type="button" class="pbl-b" aria-haspopup="listbox" aria-label="Language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg><span id="pblBtnTxt">'+nameOf(cur)+'</span><i>▾</i></button><div class="pbl-p" role="listbox">'+list+'</div>';
  var btn=el.querySelector(".pbl-b");
  btn.onclick=function(e){e.stopPropagation();if(!el.classList.contains("on"))el.querySelector(".pbl-p").innerHTML=listHTML();el.classList.toggle("on");};
  el.querySelector(".pbl-p").onclick=function(e){
    var b=e.target.closest("[data-l]");if(!b)return;e.stopPropagation();
    el.classList.remove("on");
    el.querySelectorAll("[data-l]").forEach(function(x){x.classList.toggle("on",x===b);});
    set(b.getAttribute("data-l"));
  };
  document.addEventListener("click",function(){el.classList.remove("on");});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")el.classList.remove("on");});
}

/* ---- "App install karein" patti (sirf mobile, har visit par; X se sirf is visit ke liye band) ---- */
var deferred=null;
var isStandalone=function(){return (window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;};
var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
var isMobile=isIOS||/android|mobile/i.test(navigator.userAgent);
if("serviceWorker" in navigator&&location.protocol!=="file:"){
  window.addEventListener("load",function(){navigator.serviceWorker.register(BASE+"sw.js").catch(function(){});});
}
/* App पहले से install है? तो patti कभी न दिखे। ✕ दबाया तो 30 दिन तक न दिखे। */
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function markInstalled(){lsSet("pb-app-installed","1");hideApp();}
function appBlocked(){
  if(lsGet("pb-app-installed")==="1")return true;
  var until=+(lsGet("pb-app-x-until")||0);return until>Date.now();
}
if(isStandalone())lsSet("pb-app-installed","1");   /* app के अंदर से खोला गया = install है */
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;
  if(lsGet("pb-app-installed")==="1")lsSet("pb-app-installed","");   /* browser फिर install offer कर रहा = app हटाया जा चुका */
  showApp();});
window.addEventListener("appinstalled",function(){markInstalled();});
var acss=".pba{display:flex;align-items:center;gap:10px;background:#0b2f73;color:#fff;padding:9px 12px;font-family:inherit;position:relative;z-index:60}"+
".pba img{width:34px;height:34px;border-radius:9px;flex:none;background:#fff}"+
".pba .tx{flex:1;min-width:0;line-height:1.25}.pba b{display:block;font-size:14px}.pba small{display:block;font-size:12px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
".pba .ib{flex:none;background:#ffd21f;color:#12141c;border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap}"+
".pba .x{flex:none;background:none;border:0;color:#fff;opacity:.8;font-size:20px;line-height:1;padding:4px 2px 4px 4px;cursor:pointer}"+
".pba-h{background:#e8f1ff;color:#0b2f73;font-size:13.5px;line-height:1.5;padding:10px 14px;display:flex;gap:10px;align-items:flex-start}"+
".pba-h[hidden]{display:none}.pba-h span{flex:1}.pba-h button{flex:none;border:0;background:#1a73e8;color:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}";
function appEl(){return document.getElementById("pbApp");}
function showApp(){
  if(!isMobile||isStandalone()||appBlocked())return;
  if(!document.body){document.addEventListener("DOMContentLoaded",showApp);return;}
  if(appEl())return;
  if(!document.getElementById("pbAppCss")){var st2=document.createElement("style");st2.id="pbAppCss";st2.textContent=acss;document.head.appendChild(st2);}
  var w=document.createElement("div");w.id="pbApp";
  w.innerHTML='<div class="pba" role="region" aria-label="Install app"><img src="'+BASE+'icon-192.png" alt=""><div class="tx"><b>PataBook App</b><small data-a="app_s"></small></div><button type="button" class="ib" data-a="app_b"></button><button type="button" class="x" aria-label="Close">✕</button></div><div class="pba-h" hidden><span></span><button type="button" data-a="app_ok"></button></div>';
  document.body.insertBefore(w,document.body.firstChild);
  appText();
  w.querySelector(".ib").onclick=function(){
    if(deferred){deferred.prompt();deferred.userChoice.then(function(r){if(r&&r.outcome==="accepted")markInstalled();deferred=null;});return;}
    var h=w.querySelector(".pba-h");h.hidden=false;h.querySelector("span").textContent=t(isIOS?"app_ios":"app_gen");
  };
  w.querySelector(".pba-h button").onclick=function(){w.querySelector(".pba-h").hidden=true;};
  w.querySelector(".x").onclick=function(){lsSet("pb-app-x-until",String(Date.now()+30*864e5));hideApp();};
}
function hideApp(){var w=appEl();if(w)w.remove();}
function appText(){
  var w=appEl();if(!w)return;
  w.querySelectorAll("[data-a]").forEach(function(el){el.textContent=t(el.getAttribute("data-a"));});
  var h=w.querySelector(".pba-h");if(h&&!h.hidden)h.querySelector("span").textContent=t(isIOS?"app_ios":"app_gen");
}
/* पहली बार: Android Chrome जैसे browsers खुद बताते हैं कि app install है या नहीं */
(function startApp(){
  if(!isMobile||isStandalone()||appBlocked())return;
  if(isIOS)return showApp();                                   /* iPhone: browser ऐसा कुछ नहीं बताता */
  var check=navigator.getInstalledRelatedApps?navigator.getInstalledRelatedApps().catch(function(){return [];}):Promise.resolve([]);
  check.then(function(apps){
    if(apps&&apps.length){markInstalled();return;}
    if("onbeforeinstallprompt" in window)return;               /* install हो सकता है तभी browser event भेजेगा → तब patti */
    showApp();                                                  /* बाकी browsers: ✕ वाला नियम लागू */
  });
})();

window.PB={t:t,apply:apply,set:set,mount:mount,onChange:function(f){subs.push(f);},lang:function(){return cur;},langs:LANGS};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){biApply(document);});else biApply(document);
})();
