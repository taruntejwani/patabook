/* PataBook: page badalte samay app jaisa slide.
   Aage jaane par naya page daayen se aata hai; peeche (back) jaane par baayen se.
   Sirf tab jab user isi site ke kisi page se aaya ho; app khulte hi nahi. */
(function(){
try{
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
/* "वापस" button dabane par agla page peeche-wali disha me aaye */
document.addEventListener("click",function(e){
  var t=e.target&&e.target.closest&&e.target.closest(".back,#backBtn,[data-back]");
  if(t){try{sessionStorage.setItem("pb-slide-back","1");}catch(x){}}
},true);
var back=false;
try{back=sessionStorage.getItem("pb-slide-back")==="1";sessionStorage.removeItem("pb-slide-back");}catch(x){}
try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="back_forward")back=true;}catch(x){}
/* peeche aane par browser purana page cache se seedha dikhata hai (reload nahi) — tab bhi baayen se sarkao */
window.addEventListener("pageshow",function(e){
  if(e.persisted&&document.body&&document.body.animate){document.body.animate([{transform:"translateX(-26%)",opacity:.4},{transform:"none",opacity:1}],{duration:220,easing:"ease-out"});}
});
var r=document.referrer||"";if(!r||r.indexOf(location.origin)!==0)return;
var from=back?"-26%":"26%";
var s=document.createElement("style");
s.textContent="@keyframes pbSlideIn{from{transform:translateX("+from+");opacity:.4}to{transform:none;opacity:1}}body{animation:pbSlideIn .22s ease-out}";
document.head.appendChild(s);
}catch(e){}
})();
