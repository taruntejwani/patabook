/* PataBook: ek page se doosre par jaate samay naya page daayen se baayen sarakta hai (app jaisa).
   Sirf tab chalta hai jab user isi site ke kisi page se aaya ho; app khulte hi / bahar se aane par nahi. */
(function(){
try{
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var r=document.referrer||"";if(!r||r.indexOf(location.origin)!==0)return;
var s=document.createElement("style");
s.textContent="@keyframes pbSlideIn{from{transform:translateX(26%);opacity:.4}to{transform:none;opacity:1}}body{animation:pbSlideIn .22s ease-out}";
document.head.appendChild(s);
}catch(e){}
})();
