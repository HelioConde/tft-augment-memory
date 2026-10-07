const toggle=document.querySelector("[data-language-toggle]");
let lang=localStorage.getItem("tft-augment-memory:language")==="en"?"en":"pt";
function apply(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-lang]").forEach(function(section){section.hidden=section.dataset.lang!==lang;});
  if(toggle)toggle.textContent=lang==="pt"?"EN":"PT-BR";
  localStorage.setItem("tft-augment-memory:language",lang);
}
if(toggle)toggle.addEventListener("click",function(){lang=lang==="pt"?"en":"pt";apply();});
apply();