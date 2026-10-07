const RECENT_KEY="tft-augment-memory:recent:v1";
const LANGUAGE_KEY="tft-augment-memory:language";

const ui={
  pt:{
    eyebrow:"TFT · HISTÓRICO PESSOAL",
    heroTitle:'Você lembra do augment. <span>Agora lembre do contexto.</span>',
    heroText:"Veja quais augments aparecem mais no seu histórico recente, como foram suas colocações e quais combinações você repetiu — sem confundir correlação pessoal com tier list.",
    riotId:"Riot ID",server:"Servidor",search:"Ver minha memória",
    privacy:"Consulta pública via backend gamer. Nenhuma chave Riot fica no navegador.",recent:"Buscas recentes",
    memoryTitle:"O QUE A MEMÓRIA GUARDA",memory1:"O que você repete",memory1Text:"Frequência por augment no recorte.",
    memory2:"Como terminou",memory2Text:"Colocação média e taxa de Top 4.",memory3:"Com quem combina",memory3Text:"Parceiros de augment que reaparecem.",
    loadingTitle:"Consultando seu histórico TFT…",loadingText:"O backend pode usar cache e completar a amostra em etapas.",
    analysis:"MEMÓRIA DO JOGADOR",currentSet:"Set atual",games:"Partidas",gamesHelp:"no recorte",
    unique:"Augments únicos",uniqueHelp:"escolhas diferentes",mostPicked:"Mais escolhido",bestAvg:"Melhor média",bestAvgHelp:"mín. 2 usos",
    library:"SUA BIBLIOTECA",libraryTitle:"Augments do período",sortFreq:"Frequência",sortAvg:"Média",
    detail:"DETALHE",selectAugment:"Escolha um augment",ad:"PUBLICIDADE",adNote:"espaço reservado · fora da análise principal",
    timeline:"LINHA DO TEMPO",timelineTitle:"Augments por partida",methodEyebrow:"COMO LER",
    methodTitle:"Histórico pessoal não é tier list.",methodText:"A colocação média mostra o que aconteceu nas suas partidas com aquele augment. Ela não prova que o augment causou o resultado e não substitui contexto de patch, comp, lobby ou itemização.",
    riotDisclaimer:"Produto independente. Teamfight Tactics e Riot Games são marcas da Riot Games, Inc.",
    about:"Sobre",privacyLink:"Privacidade",terms:"Termos",
    invalid:"Use um Riot ID no formato Nome#TAG.",loading:"Consultando Riot…",notFound:"Riot ID não encontrado.",
    rate:"Limite temporário da Riot atingido. Tente novamente em instantes.",error:"Não foi possível consultar a Riot agora.",
    live:"Dados Riot carregados.",empty:"Nenhuma partida TFT encontrada neste período.",recentNone:"Nenhuma busca recente.",
    sample:function(games,augments){return games+" partidas · "+augments+" augments únicos";},
    uses:"usos",avg:"média",top4:"Top 4",lastSeen:"Última vez",partners:"Parceiros frequentes",placements:"Colocações",
    noPartners:"Nenhum parceiro repetido nesta amostra.",played:"Partida",set:"Set",open:"Abrir"
  },
  en:{
    eyebrow:"TFT · PERSONAL HISTORY",
    heroTitle:'You remember the augment. <span>Now remember the context.</span>',
    heroText:"See which augments appear most in your recent history, how you placed with them and which combinations you repeated — without confusing personal correlation with a tier list.",
    riotId:"Riot ID",server:"Server",search:"See my memory",
    privacy:"Public lookup through the gamer backend. No Riot key is exposed in the browser.",recent:"Recent searches",
    memoryTitle:"WHAT MEMORY KEEPS",memory1:"What you repeat",memory1Text:"Augment frequency in the sample.",
    memory2:"How it ended",memory2Text:"Average placement and Top 4 rate.",memory3:"What it pairs with",memory3Text:"Augment partners that repeat.",
    loadingTitle:"Loading your TFT history…",loadingText:"The backend may use cache and complete the sample in stages.",
    analysis:"PLAYER MEMORY",currentSet:"Current set",games:"Games",gamesHelp:"in the sample",
    unique:"Unique augments",uniqueHelp:"different choices",mostPicked:"Most picked",bestAvg:"Best average",bestAvgHelp:"min. 2 uses",
    library:"YOUR LIBRARY",libraryTitle:"Augments in this period",sortFreq:"Frequency",sortAvg:"Average",
    detail:"DETAIL",selectAugment:"Choose an augment",ad:"ADVERTISEMENT",adNote:"reserved space · outside the main analysis",
    timeline:"TIMELINE",timelineTitle:"Augments by match",methodEyebrow:"HOW TO READ",
    methodTitle:"Personal history is not a tier list.",methodText:"Average placement shows what happened in your matches with that augment. It does not prove the augment caused the result and does not replace patch, comp, lobby or itemization context.",
    riotDisclaimer:"Independent product. Teamfight Tactics and Riot Games are trademarks of Riot Games, Inc.",
    about:"About",privacyLink:"Privacy",terms:"Terms",
    invalid:"Use a Riot ID in the Name#TAG format.",loading:"Checking Riot…",notFound:"Riot ID not found.",
    rate:"Riot rate limit is temporarily active. Try again shortly.",error:"Riot data is unavailable right now.",
    live:"Riot data loaded.",empty:"No TFT matches were found in this period.",recentNone:"No recent searches.",
    sample:function(games,augments){return games+" games · "+augments+" unique augments";},
    uses:"uses",avg:"average",top4:"Top 4",lastSeen:"Last seen",partners:"Frequent partners",placements:"Placements",
    noPartners:"No repeated partner in this sample.",played:"Match",set:"Set",open:"Open"
  }
};

let lang=localStorage.getItem(LANGUAGE_KEY)==="en"?"en":"pt";
let liveMatches=[];
let currentPlayer=null;
let period="month";
let sortMode="count";
let selectedAugment="";
let aggregateData=null;

function $(selector){return document.querySelector(selector);}
function t(key){return ui[lang][key]||key;}
function esc(value){
  return String(value==null?"":value).replace(/[&<>"']/g,function(char){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
  });
}
function locale(){return lang==="pt"?"pt-BR":"en-US";}
function cleanName(value){
  return String(value||"")
    .replace(/^TFT\d+_Augment_/i,"")
    .replace(/^TFT_Augment_/i,"")
    .replace(/^TFT\d+_/i,"")
    .replace(/^TFT_?/i,"")
    .replace(/_/g," ")
    .replace(/([a-z])([A-Z])/g,"$1 $2")
    .replace(/\s+/g," ")
    .trim()||"—";
}
function parseRiotId(value){
  const raw=String(value||"").trim();
  const split=raw.lastIndexOf("#");
  if(split<=0)return null;
  const gameName=raw.slice(0,split).trim();
  const tagLine=raw.slice(split+1).trim();
  if(!gameName||!tagLine)return null;
  return {gameName:gameName.slice(0,16),tagLine:tagLine.slice(0,6)};
}
function average(values){
  if(!values.length)return 0;
  return values.reduce(function(sum,value){return sum+Number(value||0);},0)/values.length;
}
function setStatus(kind,message){
  const host=$("#status");
  host.className="status"+(kind?" "+kind:"");
  host.textContent=message||"";
}
function setLoading(value){
  $("#loading").hidden=!value;
  $("#lookup-form").querySelector("button[type=submit]").disabled=value;
  if(value)setStatus("",t("loading"));
}
function readRecent(){
  try{
    const parsed=JSON.parse(localStorage.getItem(RECENT_KEY)||"[]");
    return Array.isArray(parsed)?parsed.slice(0,5):[];
  }catch(error){return [];}
}
function saveRecent(item){
  const key=item.gameName.toLowerCase()+"#"+item.tagLine.toLowerCase()+"@"+item.platform;
  const next=[item].concat(readRecent().filter(function(row){
    return row.gameName.toLowerCase()+"#"+row.tagLine.toLowerCase()+"@"+row.platform!==key;
  })).slice(0,5);
  localStorage.setItem(RECENT_KEY,JSON.stringify(next));
  renderRecent();
}
function renderRecent(){
  const host=$("#recent-searches");
  const items=readRecent();
  host.innerHTML=items.length?items.map(function(item,index){
    return '<button class="recent-search" type="button" data-recent="'+index+'">'+esc(item.gameName+"#"+item.tagLine)+" · "+esc(item.platform.toUpperCase())+'</button>';
  }).join(""):'<span class="muted">'+esc(t("recentNone"))+'</span>';
}
function matchesForPeriod(){
  const sorted=liveMatches.slice().sort(function(a,b){return Number(b.playedAt||0)-Number(a.playedAt||0);});
  if(period==="set"){
    const newest=sorted.find(function(match){return Number(match.setNumber)>0;});
    return newest?sorted.filter(function(match){return Number(match.setNumber)===Number(newest.setNumber);}):sorted;
  }
  const days=period==="week"?7:30;
  const cutoff=Date.now()-days*86400000;
  return sorted.filter(function(match){return Number(match.playedAt||0)>=cutoff;});
}
function buildAggregate(matches){
  const valid=matches.filter(function(match){
    return Number(match.placement)>=1&&Number(match.placement)<=8&&Array.isArray(match.augments)&&match.augments.length;
  });
  const map=new Map();
  valid.forEach(function(match){
    const names=match.augments.map(cleanName).filter(function(name){return name&&name!=="—";});
    names.forEach(function(name){
      const row=map.get(name)||{name:name,count:0,placements:[],top4:0,lastSeen:0,partners:new Map(),matches:[]};
      row.count++;
      row.placements.push(Number(match.placement));
      if(Number(match.placement)<=4)row.top4++;
      row.lastSeen=Math.max(row.lastSeen,Number(match.playedAt||0));
      row.matches.push(match);
      names.filter(function(other){return other!==name;}).forEach(function(other){
        row.partners.set(other,(row.partners.get(other)||0)+1);
      });
      map.set(name,row);
    });
  });
  const rows=Array.from(map.values()).map(function(row){
    return {
      name:row.name,
      count:row.count,
      avg:average(row.placements),
      top4Rate:row.count?Math.round(row.top4/row.count*100):0,
      lastSeen:row.lastSeen,
      placements:row.placements.slice(),
      partners:Array.from(row.partners.entries()).sort(function(a,b){return b[1]-a[1];}),
      matches:row.matches.slice()
    };
  });
  return {matches:valid,augments:rows};
}
function sortedAugments(){
  if(!aggregateData)return[];
  const rows=aggregateData.augments.slice();
  if(sortMode==="avg")return rows.sort(function(a,b){return a.avg-b.avg||b.count-a.count;});
  if(sortMode==="top4")return rows.sort(function(a,b){return b.top4Rate-a.top4Rate||b.count-a.count;});
  return rows.sort(function(a,b){return b.count-a.count||a.avg-b.avg;});
}
function formatDate(value){
  if(!value)return"—";
  return new Date(Number(value)).toLocaleDateString(locale(),{day:"2-digit",month:"2-digit",year:"2-digit"});
}
function formatNumber(value,digits){
  return Number(value||0).toLocaleString(locale(),{minimumFractionDigits:digits||0,maximumFractionDigits:digits==null?0:digits});
}
function renderMetrics(){
  const rows=aggregateData?aggregateData.augments:[];
  const matches=aggregateData?aggregateData.matches:[];
  $("#metric-games").textContent=matches.length;
  $("#metric-unique").textContent=rows.length;
  const most=rows.slice().sort(function(a,b){return b.count-a.count;})[0];
  $("#metric-most").textContent=most?most.name:"—";
  $("#metric-most-note").textContent=most?most.count+" "+t("uses"):"—";
  const eligible=rows.filter(function(row){return row.count>=2;}).sort(function(a,b){return a.avg-b.avg||b.count-a.count;});
  $("#metric-best").textContent=eligible[0]?formatNumber(eligible[0].avg,1):"—";
  $("#sample-note").textContent=ui[lang].sample(matches.length,rows.length);
}
function renderAugments(){
  const host=$("#augment-grid");
  const rows=sortedAugments();
  if(!rows.length){
    host.innerHTML='<div class="augment-detail empty">'+esc(t("empty"))+'</div>';
    return;
  }
  if(!selectedAugment||!rows.some(function(row){return row.name===selectedAugment;}))selectedAugment=rows[0].name;
  host.innerHTML=rows.map(function(row){
    const quality=row.avg<=4?"good":"bad";
    return '<button class="augment-card '+(row.name===selectedAugment?"active":"")+'" type="button" data-augment="'+esc(row.name)+'">'+
      '<div><strong>'+esc(row.name)+'</strong><span>'+row.count+' '+esc(t("uses"))+' · '+esc(t("top4"))+' '+row.top4Rate+'%</span></div>'+
      '<small class="'+quality+'">'+esc(t("avg"))+' '+formatNumber(row.avg,1)+'</small>'+
      '</button>';
  }).join("");
}
function renderDetail(){
  const host=$("#augment-detail");
  const row=aggregateData&&aggregateData.augments.find(function(item){return item.name===selectedAugment;});
  $("#detail-title").textContent=row?row.name:t("selectAugment");
  if(!row){
    host.className="augment-detail empty";
    host.textContent=t("selectAugment");
    return;
  }
  host.className="augment-detail";
  const placements=row.placements.slice().sort(function(a,b){return a-b;}).join(" · ");
  const partners=row.partners.slice(0,5);
  const partnerHtml=partners.length?'<div class="partner-list">'+partners.map(function(pair){
    return '<b>'+esc(pair[0])+' · '+pair[1]+'x</b>';
  }).join("")+'</div>':'<small>'+esc(t("noPartners"))+'</small>';
  host.innerHTML=
    '<div class="detail-stat"><span>'+esc(t("uses"))+'</span><strong>'+row.count+'</strong><small>'+esc(t("lastSeen"))+' · '+esc(formatDate(row.lastSeen))+'</small></div>'+
    '<div class="detail-stat"><span>'+esc(t("avg"))+'</span><strong>'+formatNumber(row.avg,2)+'</strong><small>'+esc(t("top4"))+' · '+row.top4Rate+'%</small></div>'+
    '<div class="detail-stat"><span>'+esc(t("placements"))+'</span><strong>'+esc(placements||"—")+'</strong></div>'+
    '<div class="detail-stat"><span>'+esc(t("partners"))+'</span>'+partnerHtml+'</div>';
}
function renderTimeline(){
  const host=$("#timeline-list");
  const matches=aggregateData?aggregateData.matches.slice().sort(function(a,b){return Number(b.playedAt||0)-Number(a.playedAt||0);}):[];
  $("#timeline-count").textContent=matches.length?matches.length+" / "+t("games"):"";
  host.innerHTML=matches.length?matches.slice(0,20).map(function(match){
    const placement=Number(match.placement||0);
    const augments=(match.augments||[]).map(cleanName).filter(Boolean);
    return '<article class="timeline-row">'+
      '<span class="timeline-date">'+esc(formatDate(match.playedAt))+'</span>'+
      '<strong class="placement '+(placement<=4?"top4":"bottom")+'">'+placement+'º</strong>'+
      '<div class="timeline-augments">'+augments.map(function(name){return '<span>'+esc(name)+'</span>';}).join("")+'</div>'+
      '</article>';
  }).join(""):'<div class="augment-detail empty">'+esc(t("empty"))+'</div>';
}
function render(){
  aggregateData=buildAggregate(matchesForPeriod());
  $("#result").hidden=false;
  $("#player-name").textContent=currentPlayer?currentPlayer.gameName+"#"+currentPlayer.tagLine:"—";
  document.querySelectorAll("[data-period]").forEach(function(button){button.classList.toggle("active",button.dataset.period===period);});
  document.querySelectorAll("[data-sort]").forEach(function(button){button.classList.toggle("active",button.dataset.sort===sortMode);});
  renderMetrics();
  renderAugments();
  renderDetail();
  renderTimeline();
}
function applyLanguage(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-i18n]").forEach(function(element){
    const value=t(element.dataset.i18n);
    if(typeof value==="string"&&value.indexOf("<span>")>=0)element.innerHTML=value;
    else if(typeof value==="string")element.textContent=value;
  });
  $("#language-toggle").textContent=lang==="pt"?"EN":"PT-BR";
  $("#source-pill").textContent=lang==="pt"?"DADOS RIOT":"RIOT DATA";
  localStorage.setItem(LANGUAGE_KEY,lang);
  renderRecent();
  if(liveMatches.length)render();
}
function updateUrl(gameName,tagLine,platform){
  const url=new URL(location.href);
  url.searchParams.set("riot",gameName+"#"+tagLine);
  url.searchParams.set("server",platform);
  url.searchParams.set("period",period);
  history.replaceState(null,"",url.pathname+"?"+url.searchParams.toString());
}
async function lookup(gameName,tagLine,platform){
  const endpoint=window.TFT_AUGMENT_MEMORY_BACKEND&&window.TFT_AUGMENT_MEMORY_BACKEND.tftProfile;
  if(!endpoint){setStatus("error",t("error"));return;}
  setLoading(true);
  $("#result").hidden=true;
  try{
    const controller=new AbortController();
    const timer=setTimeout(function(){controller.abort();},18000);
    const response=await fetch(endpoint,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({gameName:gameName,tagLine:tagLine,platform:platform}),
      signal:controller.signal
    });
    clearTimeout(timer);
    const data=await response.json().catch(function(){return{};});
    const transport=data&&data._transportError;
    const status=Number((transport&&transport.status)||response.status||0);
    const code=String((transport&&transport.code)||data.error||"");
    if(!response.ok||data.error||transport){
      if(status===404||code.indexOf("not_found")>=0)throw{kind:"notFound"};
      if(status===429||code.indexOf("rate")>=0)throw{kind:"rate"};
      throw{kind:"error"};
    }
    liveMatches=Array.isArray(data.matches)?data.matches:[];
    currentPlayer=data.player||{gameName:gameName,tagLine:tagLine,platform:platform.toUpperCase()};
    saveRecent({gameName:currentPlayer.gameName||gameName,tagLine:currentPlayer.tagLine||tagLine,platform:platform});
    selectedAugment="";
    setStatus("success",t("live"));
    updateUrl(currentPlayer.gameName||gameName,currentPlayer.tagLine||tagLine,platform);
    render();
    $("#result").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    setStatus("error",t(error&&error.kind?error.kind:"error"));
  }finally{
    setLoading(false);
  }
}

$("#lookup-form").addEventListener("submit",function(event){
  event.preventDefault();
  const parsed=parseRiotId($("#riot-id").value);
  if(!parsed){setStatus("error",t("invalid"));$("#riot-id").focus();return;}
  lookup(parsed.gameName,parsed.tagLine,$("#server").value);
});
$("#language-toggle").addEventListener("click",function(){lang=lang==="pt"?"en":"pt";applyLanguage();});
$("#recent-toggle").addEventListener("click",function(){const host=$("#recent-searches");host.hidden=!host.hidden;});
document.addEventListener("click",function(event){
  const recent=event.target.closest("[data-recent]");
  if(recent){
    const item=readRecent()[Number(recent.dataset.recent)];
    if(item){
      $("#riot-id").value=item.gameName+"#"+item.tagLine;
      $("#server").value=item.platform;
      $("#recent-searches").hidden=true;
      lookup(item.gameName,item.tagLine,item.platform);
    }
    return;
  }
  const periodButton=event.target.closest("[data-period]");
  if(periodButton){
    period=periodButton.dataset.period;
    selectedAugment="";
    if(currentPlayer)updateUrl(currentPlayer.gameName,currentPlayer.tagLine,$("#server").value);
    render();
    return;
  }
  const sortButton=event.target.closest("[data-sort]");
  if(sortButton){
    sortMode=sortButton.dataset.sort;
    renderAugments();
    renderDetail();
    document.querySelectorAll("[data-sort]").forEach(function(button){button.classList.toggle("active",button===sortButton);});
    return;
  }
  const card=event.target.closest("[data-augment]");
  if(card){
    selectedAugment=card.dataset.augment;
    renderAugments();
    renderDetail();
  }
});

(function boot(){
  applyLanguage();
  renderRecent();
  const params=new URLSearchParams(location.search);
  if(["week","month","set"].includes(params.get("period")))period=params.get("period");
  const parsed=parseRiotId(params.get("riot"));
  const server=String(params.get("server")||"br1").toLowerCase();
  if(parsed){
    $("#riot-id").value=parsed.gameName+"#"+parsed.tagLine;
    if(Array.from($("#server").options).some(function(option){return option.value===server;}))$("#server").value=server;
    lookup(parsed.gameName,parsed.tagLine,server);
  }
})();