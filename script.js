const photos=['foto-01.jpeg', 'foto-02.jpeg', 'foto-03.jpeg', 'foto-04.jpeg', 'foto-05.jpeg', 'foto-06.jpeg', 'foto-07.jpeg', 'foto-08.jpeg', 'foto-09.jpeg', 'foto-10.jpeg', 'lembranca-01.jpg', 'lembranca-02.jpg', 'lembranca-03.jpg', 'lembranca-04.jpg', 'lembranca-05.jpg', 'lembranca-06.jpg', 'lembranca-07.jpg'];
const $=id=>document.getElementById(id);
const nav=$("nav");
$("menuBtn").addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
let index=0,timer=null;
const song=$("song");
function show(n){index=(n+photos.length)%photos.length;const img=$("slide");img.style.opacity="0";setTimeout(()=>{img.src=photos[index];img.onload=()=>img.style.opacity="1";},150);$("count").textContent=`${String(index+1).padStart(2,"0")} / ${photos.length}`;}
$("prev").addEventListener("click",()=>show(index-1));
$("next").addEventListener("click",()=>show(index+1));
function startTimer(){clearInterval(timer);timer=setInterval(()=>show(index+1),4300);}
$("play").addEventListener("click",async()=>{if(song.paused){try{await song.play();$("play").textContent="Pausar música";$("audioStatus").textContent="A música está tocando. As lembranças passam devagar.";startTimer();}catch(e){$("audioStatus").textContent="Não foi possível iniciar o áudio. Tente novamente.";}}else{song.pause();clearInterval(timer);$("play").textContent="Continuar música";$("audioStatus").textContent="Música pausada.";}});
song.addEventListener("ended",()=>{clearInterval(timer);$("play").textContent="Ouvir nossa música";show(photos.length-1);$("audioStatus").textContent="Obrigada por ouvir e recordar.";});

const area=$("messageText"),status=$("messageStatus"),saved=localStorage.getItem("mavi-message-draft");
if(saved)area.value=saved;
$("saveMessage").addEventListener("click",()=>{localStorage.setItem("mavi-message-draft",area.value);status.textContent="Mensagem guardada neste aparelho."; });
$("clearMessage").addEventListener("click",()=>{area.value="";localStorage.removeItem("mavi-message-draft");status.textContent="Texto apagado deste aparelho."; });
