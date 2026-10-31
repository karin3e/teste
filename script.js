const $ = (id) => document.getElementById(id);

const nav = $("nav");
$("menuButton").addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  $("menuButton").setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  $("menuButton").setAttribute("aria-expanded", "false");
}));

const photos = [
  ...Array.from({length:10},(_,i)=>`foto-${String(i+1).padStart(2,"0")}.jpeg`),
  "lembranca-01.jpeg", "lembranca-02.jpeg", "lembranca-03.jpg",
  "lembranca-04.jpeg", "lembranca-05.jpeg", "lembranca-06.jpeg", "lembranca-07.jpeg"
];
let photoIndex=0;
let slideshowTimer=null;
let song=$("ourSong");
const oldSong=$("ourSong");
const newSong=$("newSong");
const dedicationSong=$("dedicationSong");
const photoImg=$("slidePhoto");
let photoLoadToken=0;

function setPhoto(index){
  photoIndex=(index+photos.length)%photos.length;
  const token=++photoLoadToken;
  const frame=$("memoryStageFrame");
  frame.classList.add("changing");
  const nextSrc=photos[photoIndex];
  const preload=new Image();
  preload.onload=()=>{
    if(token!==photoLoadToken)return;
    photoImg.src=nextSrc;
    photoImg.style.filter="none";
    photoImg.style.opacity="1";
    photoImg.style.visibility="visible";
    $("photoCounter").textContent=`${String(photoIndex+1).padStart(2,"0")} / ${photos.length}`;
    $("memoryProgress").style.width=`${((photoIndex+1)/photos.length)*100}%`;
    frame.style.setProperty("--photo-tilt",photoIndex%2?"1.2deg":"-1.2deg");
    requestAnimationFrame(()=>requestAnimationFrame(()=>frame.classList.remove("changing")));
    window.setTimeout(()=>frame.classList.remove("changing"),700);
    const next=new Image();
    next.src=photos[(photoIndex+1)%photos.length];
  };
  preload.onerror=()=>{
    if(token!==photoLoadToken)return;
    $("photoCounter").textContent=`${String(photoIndex+1).padStart(2,"0")} / ${photos.length}`;
    frame.classList.remove("changing");
  };
  preload.src=nextSrc;
}
function stopSlideshow(){
  if(slideshowTimer){clearInterval(slideshowTimer);slideshowTimer=null;}
}
function startSlideshow(){
  stopSlideshow();
  slideshowTimer=setInterval(()=>setPhoto(photoIndex+1),6500);
}
function syncMusicUI(){
  $("playShow").textContent=song.paused?"▶":"Ⅱ";
  $("currentTrackName").textContent=song===dedicationSong?"Pra você, Mavi":song===newSong?"Nossa música nova":"Lisboa";
}
async function playCurrentSong(){
  try{
    await song.play();
    syncMusicUI();
    $("musicHint").textContent="Respira, olha as fotos e deixa as lembranças passarem no seu tempo.";
    startSlideshow();
    $("songEnding").hidden=true;
  }catch(err){
    $("musicHint").textContent="Não foi possível iniciar essa faixa. Toque novamente ou escolha a outra música.";
    stopSlideshow();
  }
}
function chooseSong(which){
  const wasPlaying=!song.paused;
  stopSlideshow();
  song.pause();
  song.currentTime=0;
  song=which==="dedication"?dedicationSong:which==="new"?newSong:oldSong;
  $("chooseLisboa").classList.toggle("active",song===oldSong);
  $("chooseNewSong").classList.toggle("active",song===newSong);
  $("chooseDedication").classList.toggle("active",song===dedicationSong);
  syncMusicUI();
  $("musicHint").textContent=song===dedicationSong?"Sua dedicatória está selecionada.":song===newSong?"Nossa música nova selecionada.":"Lisboa selecionada.";
  if(wasPlaying)playCurrentSong();
}
$("chooseLisboa").addEventListener("click",()=>chooseSong("lisboa"));
$("chooseNewSong").addEventListener("click",()=>chooseSong("new"));
$("chooseDedication").addEventListener("click",()=>chooseSong("dedication"));
$("prevPhoto").addEventListener("click",()=>setPhoto(photoIndex-1));
$("nextPhoto").addEventListener("click",()=>setPhoto(photoIndex+1));
$("playShow").addEventListener("click",()=>{
  if(song.paused)playCurrentSong();
  else{
    song.pause();
    stopSlideshow();
    syncMusicUI();
    $("musicHint").textContent="A música está pausada. Continue quando quiser.";
  }
});
[oldSong,newSong,dedicationSong].forEach(track=>{
  track.preload="none";
  track.addEventListener("play",()=>{if(track===song)syncMusicUI();});
  track.addEventListener("pause",()=>{if(track===song){syncMusicUI();if(track.currentTime>0)stopSlideshow();}});
  track.addEventListener("ended",()=>{
    if(track!==song)return;
    stopSlideshow();
    syncMusicUI();
    $("songEnding").hidden=false;
    setPhoto(photos.length-1);
  });
  track.addEventListener("error",()=>{
    if(track===song)$("musicHint").textContent="Essa música não pôde ser carregada. Confira o arquivo de áudio.";
  });
});
photoImg.loading="eager";
photoImg.decoding="async";
setPhoto(0);
let score = 0;
let gameActive = false;
let gameInterval = null;
let gameTimeout = null;
function finishGame() {
  gameActive = false;
  window.clearInterval(gameInterval);
  window.clearTimeout(gameTimeout);
  $("startGame").disabled = false;
  $("startGame").textContent = "Jogar de novo";
  $("gameMessage").textContent = `Tempo! Você marcou ${score} ponto${score === 1 ? "" : "s"}.`;
}
$("startGame").addEventListener("click", () => {
  window.clearInterval(gameInterval);
  window.clearTimeout(gameTimeout);
  score = 0;
  $("score").textContent = "0";
  gameActive = true;
  $("startGame").disabled = true;
  $("startGame").textContent = "Jogando...";
  $("gameMessage").textContent = "Vai, toca na Karine!";
  let remaining = 20;
  gameInterval = window.setInterval(() => {
    remaining -= 1;
    $("gameMessage").textContent = `Toca pra marcar pontos! ${remaining}s`;
    if (remaining <= 0) finishGame();
  }, 1000);
  gameTimeout = window.setTimeout(finishGame, 20000);
});
$("karineTarget").addEventListener("click", () => {
  if (!gameActive) {
    $("gameMessage").textContent = "Aperta “Começar jogo” primeiro.";
    return;
  }
  score += 1;
  $("score").textContent = String(score);
  const target = $("karineTarget");
  target.classList.remove("hit");
  void target.offsetWidth;
  target.classList.add("hit");
});
$("resetGame").addEventListener("click", () => {
  gameActive = false;
  window.clearInterval(gameInterval);
  window.clearTimeout(gameTimeout);
  score = 0;
  $("score").textContent = "0";
  $("startGame").disabled = false;
  $("startGame").textContent = "Começar jogo";
  $("gameMessage").textContent = "Pontos zerados. Pode começar quando quiser.";
});
const messageArea = $("messageText");
const messageStatus = $("messageStatus");
if (messageArea) {
  const savedMessage = localStorage.getItem("mavi-message-draft");
  if (savedMessage) messageArea.value = savedMessage;
  $("saveMessage").addEventListener("click", () => {
    localStorage.setItem("mavi-message-draft", messageArea.value);
    messageStatus.textContent = "Mensagem guardada neste aparelho. Ela não foi enviada pela internet.";
  });
  $("clearMessage").addEventListener("click", () => {
    messageArea.value = "";
    localStorage.removeItem("mavi-message-draft");
    messageStatus.textContent = "Texto apagado deste aparelho.";
  });
}
$("giftBox").addEventListener("click", () => {
  $("giftBox").classList.add("open");
  $("revealed").hidden = false;
  $("giftBox").setAttribute("aria-expanded", "true");
});


// História em quadrinhos: capítulos narrados a partir do relato da Karine.
const comicChapters = [
  {
    title:"Capítulo 1 — O começo",
    panels:[
      {scene:"school",tag:"ANTES DE TUDO",text:"Karine estava no 9º ano. Maria Vitória, no 7º… ou talvez no 6º. Foi ali que as duas começaram a conversar.",say:"Quem diria que uma conversa qualquer ia virar uma história tão grande?"},
      {scene:"school",tag:"AS PRIMEIRAS CONVERSAS",text:"Vieram as conversas, a curiosidade e aquela aproximação que parecia não ter hora para acabar.",say:"A gente ainda nem imaginava tudo o que vinha pela frente."},
      {scene:"rain",tag:"NEM TUDO SAIU BEM",text:"Também aconteceram erros. Karine foi trocada, as coisas se complicaram e, naquela primeira tentativa, não deu certo.",say:"Às vezes, gostar não é suficiente para fazer tudo dar certo."}
    ]
  },
  {
    title:"Capítulo 2 — Quatro anos depois",
    panels:[
      {scene:"calendar",tag:"O TEMPO PASSOU",text:"A vida seguiu. Quatro anos se passaram, cada uma vivendo suas próprias fases, até que o caminho das duas se cruzou outra vez.",say:"Quatro anos. E olha quem apareceu de novo…"},
      {scene:"school",tag:"UM NOVO ENCONTRO",text:"Karine chegou ao 3º ano. Maria Vitória entrou no 1º ano da mesma escola. Aos poucos, voltaram a se conhecer.",say:"Dessa vez, a gente foi chegando devagar."},
      {scene:"glow",tag:"RECOMEÇAR",text:"As conversas voltaram, a proximidade cresceu e o passado ganhou uma nova chance.",say:"Será que agora vai?"}
    ]
  },
  {
    title:"Capítulo 3 — 21 de abril de 2026",
    panels:[
      {scene:"court",tag:"CAMPEONATO MUNICIPAL",text:"Karine tinha acabado de jogar bola na quadra. O dia já tinha sido cheio, mas ainda guardava uma surpresa.",say:"Tô cansada… mas esse dia ainda não acabou."},
      {scene:"night",tag:"O CONVITE",text:"Maria Vitória chamou Karine para dormir na casa da avó. Karine aceitou. A noite virou uma lembrança que nenhuma das duas esqueceria.",say:"Vem dormir aqui na casa da minha avó?"},
      {scene:"kiss",tag:"O PRIMEIRO BEIJO",text:"21 de março de 2026. Foi o primeiro beijo. Um daqueles momentos que mudam o jeito de olhar para alguém.",say:"Acho que a nossa história começou de verdade aqui."}
    ]
  },
  {
    title:"Capítulo 4 — O pedido",
    panels:[
      {scene:"flowers",tag:"23 DE MAIO DE 2026",text:"Em 23 de maio de 2026, Karine se ajoelhou, entregou um anel e pediu Maria Vitória em namoro oficialmente.",say:"Você aceita namorar comigo?"},
      {scene:"ring",tag:"AGORA É OFICIAL",text:"Vieram as fotos, as postagens e até uma publicação feita sem querer — que Karine precisou apagar rapidinho.",say:"EU POSTEI SEM QUERER! APAGA, APAGA!"},
      {scene:"party",tag:"VIDA A DOIS",text:"Vieram os beijos, as flores, os presentes e um São João vivido juntas. Pequenos momentos foram virando grandes lembranças.",say:"A gente tinha nosso próprio jeitinho de ser feliz."}
    ]
  },
  {
    title:"Capítulo 5 — O amor também erra",
    panels:[
      {scene:"door",tag:"A FUGA MAIS RÁPIDA",text:"Um dia, Karine foi à casa de Maria Vitória entregar presentes. A mãe de Mavi avisou que estava chegando… e Karine saiu correndo pela casa!",say:"ELA TÁ CHEGANDO! CADÊ A SAÍDA?"},
      {scene:"cloud",tag:"OS ERROS",text:"Mas nem tudo foi leve. Karine reconhece que traiu Maria Vitória uma primeira vez, depois uma segunda e uma terceira. Isso machucou a relação e abalou a confiança.",say:"Eu errei. E não dá para fingir que isso não teve consequências."},
      {scene:"broken",tag:"TENTATIVAS E CONSEQUÊNCIAS",text:"Houve afastamentos, tentativas e uma semana em que o namoro chegou ao fim. Mesmo assim, Karine ainda tentou recomeçar e entregou outra aliança.",say:"Eu queria consertar, mas querer não apaga o que aconteceu."}
    ]
  },
  {
    title:"Capítulo 6 — 23 de outubro",
    panels:[
      {scene:"calendar",tag:"A ÚLTIMA VEZ",text:"No dia 23 de outubro de 2026, Karine e Maria Vitória se viram pela última vez — pelo menos até agora.",say:"Eu não sabia que aquele encontro ia ficar tão marcado."},
      {scene:"sunset",tag:"COMO NO COMEÇO",text:"Naquele dia, tudo pareceu recomeçar. Foi bom, fofo, romântico. Teve o jeitinho das duas, como se por algumas horas o tempo tivesse voltado.",say:"Por um instante, parecia que a gente tinha encontrado o começo outra vez."},
      {scene:"warm",tag:"UMA LEMBRANÇA VIVA",text:"O encontro ficou guardado como um dos momentos mais especiais, justamente porque veio depois de tanta coisa.",say:"Eu queria conseguir guardar esse dia num potinho."}
    ]
  },
  {
    title:"Capítulo 7 — O que fica",
    panels:[
      {scene:"memories",tag:"TANTAS COISAS VIVIDAS",text:"Entre erros e acertos, existiram fotos, abraços, beijos, flores, São João, risadas e momentos que fizeram as duas felizes.",say:"Nossa história nunca foi feita de uma coisa só."},
      {scene:"letter",tag:"SEM APAGAR A VERDADE",text:"Karine sente a dor do fim e também reconhece a parte que lhe cabe. Amar alguém não apaga as feridas, e sentir saudade não obriga ninguém a voltar.",say:"Eu queria que tivesse sido diferente. E sei que também precisava ter feito diferente."},
      {scene:"dawn",tag:"FIM… OU SÓ UMA PAUSA?",text:"Essa história não precisa fingir que tudo foi perfeito para reconhecer que foi importante. O que aconteceu faz parte da história das duas — e cada uma merece seguir em paz.",say:"A vida é curta demais para deixar o amor sempre para depois. Se ainda existe carinho e vontade dos dois lados, talvez valha uma conversa sincera — sem pressão, só com o coração aberto."}
    ]
  }
];
let comicIndex=0;
function renderComic(){
  const chapter=comicChapters[comicIndex];
  $("comicChapterTitle").textContent=chapter.title;
  $("comicPageCount").textContent=`${String(comicIndex+1).padStart(2,"0")} / ${String(comicChapters.length).padStart(2,"0")}`;
  const comicPhotoOrder = [
    "foto-01.jpeg","foto-02.jpeg","foto-03.jpeg","foto-04.jpeg","foto-05.jpeg","foto-06.jpeg",
    "foto-07.jpeg","foto-08.jpeg","foto-09.jpeg","foto-10.jpeg","lembranca-01.jpeg","lembranca-02.jpeg",
    "lembranca-03.jpg","lembranca-04.jpeg","lembranca-05.jpeg","lembranca-06.jpeg","lembranca-07.jpeg",
    "foto-01.jpeg","foto-04.jpeg","foto-07.jpeg","foto-10.jpeg"
  ];
  $("comicPanels").innerHTML=chapter.panels.map((panel,i)=>{
    const photo=comicPhotoOrder[comicIndex*3+i];
    return `
    <article class="comic-panel comic-scene-${panel.scene}">
      <div class="comic-art">
        <img class="comic-real-photo" src="${photo}" alt="Fotografia de uma lembrança de Karine e Maria Vitória" loading="lazy">
        <span class="comic-scene-label">${panel.tag}</span>
        <span class="comic-spark" aria-hidden="true">✦</span>
      </div>
      <div class="comic-paper"><p>${panel.text}</p><div class="comic-speech">${panel.say}</div><span class="comic-panel-number">${String(i+1).padStart(2,"0")}</span></div>
    </article>`;
  }).join("");
  $("comicPrev").disabled=comicIndex===0;
  $("comicNext").disabled=comicIndex===comicChapters.length-1;
  $("comicDots").innerHTML=comicChapters.map((_,i)=>`<button type="button" class="comic-dot ${i===comicIndex?"active":""}" data-chapter="${i}" aria-label="Capítulo ${i+1}"></button>`).join("");
  $("comicDots").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{comicIndex=Number(btn.dataset.chapter);renderComic()}));
}
$("comicPrev").addEventListener("click",()=>{if(comicIndex>0){comicIndex--;renderComic()}});
$("comicNext").addEventListener("click",()=>{if(comicIndex<comicChapters.length-1){comicIndex++;renderComic()}});
renderComic();


// Jogo da memória com seis pares das fotografias do site.
const memoryGameGrid=$('memoryGameGrid');
if(memoryGameGrid){
  const memoryGamePhotos=['foto-01.jpeg','foto-02.jpeg','foto-03.jpeg','foto-04.jpeg','foto-05.jpeg','foto-06.jpeg'];
  let memoryDeck=[],memoryFirst=null,memoryLock=false,memoryFound=0,memoryAttempts=0;
  function updateMemoryStatus(){
    $('memoryPairs').textContent=`${memoryFound} de ${memoryGamePhotos.length} pares`;
    $('memoryMoves').textContent=`${memoryAttempts} ${memoryAttempts===1?'tentativa':'tentativas'}`;
  }
  function buildMemoryGame(){
    memoryDeck=memoryGamePhotos.flatMap((src,index)=>[{id:index,src},{id:index,src}]);
    for(let i=memoryDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[memoryDeck[i],memoryDeck[j]]=[memoryDeck[j],memoryDeck[i]];}
    memoryFirst=null;memoryLock=false;memoryFound=0;memoryAttempts=0;
    memoryGameGrid.innerHTML=memoryDeck.map((card,index)=>`
      <button class="memory-card" type="button" data-index="${index}" aria-label="Carta fechada">
        <span class="memory-card-inner">
          <span class="memory-card-face memory-card-back" aria-hidden="true">♡</span>
          <span class="memory-card-face memory-card-front"><img src="${card.src}" alt="Lembrança do casal"></span>
        </span>
      </button>`).join('');
    memoryGameGrid.querySelectorAll('.memory-card').forEach(button=>button.addEventListener('click',()=>flipMemoryCard(button)));
    $('memoryGameFeedback').textContent='Toque em duas cartas para encontrar um par.';
    updateMemoryStatus();
  }
  function flipMemoryCard(button){
    if(memoryLock||button.classList.contains('flipped')||button.classList.contains('matched'))return;
    const index=Number(button.dataset.index),card=memoryDeck[index];
    button.classList.add('flipped');button.setAttribute('aria-label','Carta revelada');
    if(!memoryFirst){memoryFirst={button,card};return;}
    memoryAttempts++;
    const first=memoryFirst;
    memoryFirst=null;
    if(first.card.id===card.id){
      first.button.classList.add('matched');button.classList.add('matched');
      first.button.disabled=true;button.disabled=true;memoryFound++;
      $('memoryGameFeedback').textContent=memoryFound===memoryGamePhotos.length?'Você encontrou todos os pares! Cada foto guarda um pedacinho da história. ♡':'Um par encontrado! Continue assim.';
      updateMemoryStatus();
    }else{
      memoryLock=true;
      $('memoryGameFeedback').textContent='Quase! Essas duas não formam um par.';
      updateMemoryStatus();
      window.setTimeout(()=>{
        first.button.classList.remove('flipped');button.classList.remove('flipped');
        first.button.setAttribute('aria-label','Carta fechada');button.setAttribute('aria-label','Carta fechada');
        memoryLock=false;
      },850);
    }
  }
  $('restartMemoryGame').addEventListener('click',buildMemoryGame);
  buildMemoryGame();
}

// Mensagens curtas reveladas aleatoriamente.
const surpriseMessages=[
  'Você fez parte de momentos que eu vou guardar com carinho.',
  'Nem toda lembrança precisa de uma foto para continuar viva.',
  'Que a vida te trate com a delicadeza que você merece.',
  'Obrigada por cada risada que um dia foi nossa.',
  'Mesmo quando os caminhos mudam, algumas histórias continuam importantes.',
  'Que nunca faltem motivos para você sorrir.',
  'Tem momentos simples que acabam virando inesquecíveis.',
  'Eu espero que você sempre encontre paz nas pequenas coisas.'
];
const surpriseButton=$('newSurpriseMessage');
if(surpriseButton){
  let previousMessage=-1;
  surpriseButton.addEventListener('click',()=>{
    let next=Math.floor(Math.random()*surpriseMessages.length);
    if(surpriseMessages.length>1)while(next===previousMessage)next=Math.floor(Math.random()*surpriseMessages.length);
    previousMessage=next;
    const output=$('surpriseMessageText');
    output.classList.remove('reveal');void output.offsetWidth;
    output.textContent=surpriseMessages[next];output.classList.add('reveal');
  });
}

// Envelope secreto: abre e revela a carta.
const secretEnvelope=$('secretEnvelope');
if(secretEnvelope){
  secretEnvelope.addEventListener('click',()=>{
    const isOpen=secretEnvelope.classList.toggle('open');
    secretEnvelope.setAttribute('aria-expanded',String(isOpen));
    $('secretLetter').hidden=!isOpen;
    secretEnvelope.querySelector('.envelope-hint').textContent=isOpen?'cartinha aberta ♡':'toque para abrir';
  });
}
