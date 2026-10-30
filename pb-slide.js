/* PataBook: page badalte samay Gmail/app jaisa slide.
   Aage jaane par naya page daayen se aata hai (purana thoda baayen khisakta hai);
   peeche (back) jaane par ulta. Chrome ke "cross-document view transition" se: purana page tab tak
   screen par rehta hai jab tak naya taiyaar na ho, isliye beech me safed jhalak nahi aati.
   Purane browser me: sirf naye page par chhota slide-in. */
(function(){
try{
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var KEY="pb-slide-back";
function css(t){var s=document.createElement("style");s.textContent=t;document.head.appendChild(s);}
/* "वापस" button dabane par agla page peeche-wali disha me aaye */
document.addEventListener("click",function(e){
  var t=e.target&&e.target.closest&&e.target.closest(".back,#backBtn,[data-back]");
  if(t){try{sessionStorage.setItem(KEY,"1");}catch(x){}}
},true);
var flag=false;
try{flag=sessionStorage.getItem(KEY)==="1";sessionStorage.removeItem(KEY);}catch(x){}

if("PageRevealEvent" in window){
  css("@view-transition{navigation:auto}"+
  "@keyframes pbOutL{to{transform:translateX(-22%);opacity:.55}}"+
  "@keyframes pbInR{from{transform:translateX(100%)}}"+
  "@keyframes pbOutR{to{transform:translateX(100%)}}"+
  "@keyframes pbInL{from{transform:translateX(-22%);opacity:.55}}"+
  "::view-transition-group(root){animation-duration:.28s}"+
  "::view-transition-old(root){animation:.28s cubic-bezier(.3,0,.2,1) both pbOutL;z-index:1}"+
  "::view-transition-new(root){animation:.28s cubic-bezier(.3,0,.2,1) both pbInR;z-index:2;box-shadow:-8px 0 24px #0002}"+
  ":root:active-view-transition-type(back)::view-transition-old(root){animation-name:pbOutR;z-index:2;box-shadow:-8px 0 24px #0002}"+
  ":root:active-view-transition-type(back)::view-transition-new(root){animation-name:pbInL;z-index:1;box-shadow:none}");
  window.addEventListener("pagereveal",function(e){
    var vt=e.viewTransition;if(!vt)return;
    var back=flag;
    try{if(window.navigation&&navigation.activation&&navigation.activation.navigationType==="traverse")back=true;}catch(x){}
    if(back){try{vt.types.add("back");}catch(x){}}
  });
  /* peeche aane par purana page cache se seedha dikhta hai (reload nahi) */
  window.addEventListener("pageshow",function(e){
    if(e.persisted&&!window.__pbVT&&document.body&&document.body.animate)document.body.animate([{transform:"translateX(-22%)",opacity:.55},{transform:"none",opacity:1}],{duration:240,easing:"ease-out"});
  });
  return;
}
/* fallback (purane browser) */
var back=flag;
try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="back_forward")back=true;}catch(x){}
window.addEventListener("pageshow",function(e){
  if(e.persisted&&document.body&&document.body.animate)document.body.animate([{transform:"translateX(-26%)",opacity:.4},{transform:"none",opacity:1}],{duration:220,easing:"ease-out"});
});
var r=document.referrer||"";if(!r||r.indexOf(location.origin)!==0)return;
css("@keyframes pbSlideIn{from{transform:translateX("+(back?"-26%":"26%")+");opacity:.4}to{transform:none;opacity:1}}body{animation:pbSlideIn .22s ease-out}");
}catch(e){}
})();
