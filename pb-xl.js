/* PataBook – बाकी भाषाओं (गुजराती, मराठी, बांग्ला, तमिल, तेलुगु, सिन्धी) का अनुवाद।
   पेज हिन्दी में बनते हैं; यह file हिन्दी लाइनों को चुनी गई भाषा में बदल देती है।
   शब्दकोश lang/xl-<code>.js में है: PB_XL("gu",{"हिन्दी लाइन":"ગુજરાતી લાઇન",...}).
   नई हिन्दी लाइन जोड़ो तो उसका अनुवाद हर xl-*.js में भी जोड़ो। */
(function(){
var XL={gu:1,mr:1,bn:1,ta:1,te:1,"sd-deva":1};
var DICTS={},cur=null,dict=null,re=null,pats=[];
var DEV=/[ऀ-ॿ]/;
var ATTRS=["placeholder","title","aria-label","alt"];
var orig=new WeakMap();   /* node/attr → {o: हिन्दी मूल, t: अनुवाद} */
var attrOrig=new WeakMap();

function lang(){try{return localStorage.getItem("pb-lang")||"";}catch(e){return "";}}
function base(){var s=document.currentScript;return (s&&s.src)?s.src.split("?")[0].replace(/[^\/]*$/,""):"";}
var BASE=base();

window.PB_XL=function(code,d){DICTS[code]=d;if(code===cur)use(code);};

function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function use(code){
  dict=DICTS[code]||null;re=null;pats=[];
  if(!dict)return;
  /* "{e} पर OTP भेजा" जैसी लाइनें: {…} की जगह कुछ भी हो सकता है */
  Object.keys(dict).forEach(function(k){
    if(k.indexOf("{")<0)return;var names=[];
    var src="^"+esc(k).replace(/\\\{(\w+)\\\}/g,function(m,n){names.push(n);return "(.+?)";})+"$";
    if(names.length)pats.push([new RegExp(src),names,dict[k]]);
  });
  var ks=Object.keys(dict).filter(function(k){return k.length>=4&&DEV.test(k);}).sort(function(a,b){return b.length-a.length;});
  if(ks.length)re=new RegExp("(?<![\\u0900-\\u097F])("+ks.map(esc).join("|")+")(?![\\u0900-\\u097F])","g");
}
function tr(s){
  if(!dict||!s||!DEV.test(s))return s;
  var t=s.trim();if(!t)return s;
  if(dict.hasOwnProperty(t)){var i=s.indexOf(t);return s.slice(0,i)+dict[t]+s.slice(i+t.length);}
  var n=t.replace(/\s+/g," ");
  if(n!==t&&dict.hasOwnProperty(n))return dict[n];
  for(var p=0;p<pats.length;p++){
    var m=pats[p][0].exec(n);
    if(m){var out=pats[p][2],nm=pats[p][1];for(var q=0;q<nm.length;q++)out=out.split("{"+nm[q]+"}").join(m[q+1]);var a=s.indexOf(t);return s.slice(0,a)+out+s.slice(a+t.length);}
  }
  if(!re)return s;
  return s.replace(re,function(m){return dict[m];});
}
function skip(el){
  for(var e=el;e;e=e.parentElement){
    var tg=e.tagName;if(tg==="SCRIPT"||tg==="STYLE"||tg==="TEXTAREA"||tg==="NOSCRIPT")return true;
    if(e.classList&&e.classList.contains("pbx-no"))return true;
  }
  return false;
}
function doText(n){
  var v=n.nodeValue,r=orig.get(n);
  if(r&&v===r.t)return;               /* पहले ही बदला हुआ */
  if(!DEV.test(v)){if(r)orig.delete(n);return;}
  if(skip(n.parentElement))return;
  var t=tr(v);orig.set(n,{o:v,t:t});
  if(t!==v)n.nodeValue=t;
}
function doAttrs(el){
  if(!el.getAttribute||skip(el.tagName==="TEXTAREA"?el.parentElement:el))return;   /* textarea का placeholder भी */
  var m=attrOrig.get(el);
  for(var i=0;i<ATTRS.length;i++){
    var a=ATTRS[i],v=el.getAttribute(a);if(v==null)continue;
    var r=m&&m[a];if(r&&v===r.t)continue;
    if(!DEV.test(v))continue;
    var t=tr(v);if(!m){m={};attrOrig.set(el,m);}m[a]={o:v,t:t};
    if(t!==v)el.setAttribute(a,t);
  }
}
function walk(root){
  if(!dict||!root)return;
  if(root.nodeType===3){doText(root);return;}
  if(root.nodeType!==1&&root.nodeType!==9)return;
  if(root.nodeType===1)doAttrs(root);
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT),n;
  while((n=w.nextNode())){if(n.nodeType===3)doText(n);else doAttrs(n);}
}
function restore(root){   /* हिन्दी / English पर लौटते समय मूल लाइनें वापस */
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT),n;
  while((n=w.nextNode())){
    if(n.nodeType===3){var r=orig.get(n);if(r&&n.nodeValue===r.t)n.nodeValue=r.o;orig.delete(n);}
    else{var m=attrOrig.get(n);if(m){for(var a in m){if(n.getAttribute(a)===m[a].t)n.setAttribute(a,m[a].o);}attrOrig.delete(n);}}
  }
}
var mo=null,busy=false;
function observe(){
  if(mo||!window.MutationObserver)return;
  mo=new MutationObserver(function(list){
    if(!dict||busy)return;busy=true;
    try{
      for(var i=0;i<list.length;i++){
        var m=list[i];
        if(m.type==="childList"){for(var j=0;j<m.addedNodes.length;j++)walk(m.addedNodes[j]);}
        else if(m.type==="characterData")doText(m.target);
        else if(m.type==="attributes")doAttrs(m.target);
      }
    }finally{busy=false;}
  });
  mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});
}
function run(){walk(document.documentElement);observe();}

/* alert / confirm / prompt के संदेश भी */
["alert","confirm","prompt"].forEach(function(f){
  var o=window[f];if(!o)return;
  window[f]=function(msg){var a=[].slice.call(arguments);if(dict&&typeof msg==="string")a[0]=tr(msg);return o.apply(window,a);};
});

function load(code,cb,sync){
  if(DICTS[code]){use(code);cb&&cb();return;}
  var src=BASE+"lang/xl-"+code+".js?v=1";
  if(sync&&document.readyState==="loading"){document.write('<script src="'+src+'"><\/script>');return;}
  var s=document.createElement("script");s.src=src;s.onload=function(){use(code);cb&&cb();};document.head.appendChild(s);
}
function set(code){
  if(XL[code]){
    if(cur===code&&dict)return;
    var had=!!dict;cur=code;
    load(code,function(){if(had)restore(document.documentElement);run();});
  }else{
    if(dict){restore(document.documentElement);}
    cur=code;dict=null;re=null;
  }
}
window.PBXL={tr:function(s){return tr(s);},set:set};

cur=lang();
if(XL[cur]){
  load(cur,null,true);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){if(!dict)use(cur);run();});
  else run();
}
/* भाषा बदली (i18n.js वाले पेज) */
document.addEventListener("pb-lang",function(e){set(e.detail);});
})();
