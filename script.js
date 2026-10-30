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
  ...Array.from({length: 10}, (_, i) => `foto-${String(i + 1).padStart(2, "0")}.jpeg`),
  ...Array.from({length: 7}, (_, i) => `lembranca-${String(i + 1).padStart(2, "0")}.jpg`)
];
let photoIndex = 0;
let slideshowTimer = null;
let startedShow = false;
let song = $("ourSong");
const oldSong = $("ourSong");
const newSong = $("newSong");
function selectSong(which) {
  const wasPlaying = !song.paused;
  song.pause();
  song = which === "new" ? newSong : oldSong;
  $("chooseLisboa").classList.toggle("active", which !== "new");
  $("chooseNewSong").classList.toggle("active", which === "new");
  $("playShow").textContent = "Tocar nossa música";
  $("musicHint").textContent = which === "new" ? "Música nova selecionada." : "Lisboa selecionada.";
  if (slideshowTimer) window.clearInterval(slideshowTimer);
}
$("chooseLisboa").addEventListener("click", () => selectSong("lisboa"));
$("chooseNewSong").addEventListener("click", () => selectSong("new"));

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const img = $("slidePhoto");
  img.style.opacity = "0";
  window.setTimeout(() => {
    img.src = photos[photoIndex];
    img.onload = () => { img.style.opacity = "1"; };
  }, 140);
  $("photoCounter").textContent = `${String(photoIndex + 1).padStart(2, "0")} / ${photos.length}`;
}
function startSlideshow() {
  if (slideshowTimer) window.clearInterval(slideshowTimer);
  slideshowTimer = window.setInterval(() => showPhoto(photoIndex + 1), 4200);
}
$("prevPhoto").addEventListener("click", () => showPhoto(photoIndex - 1));
$("nextPhoto").addEventListener("click", () => showPhoto(photoIndex + 1));
$("playShow").addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
      $("playShow").textContent = "Pausar música";
      $("musicHint").textContent = "A apresentação está passando. Você pode mudar as fotos ou pausar a música.";
      startSlideshow();
      startedShow = true;
      $("songEnding").hidden = true;
    } catch (e) {
      $("musicHint").textContent = "Não consegui iniciar o áudio. Tente tocar novamente.";
    }
  } else {
    song.pause();
    $("playShow").textContent = "Continuar música";
    if (slideshowTimer) window.clearInterval(slideshowTimer);
    $("musicHint").textContent = "Música pausada.";
  }
});
song.addEventListener("ended", () => {
  if (slideshowTimer) window.clearInterval(slideshowTimer);
  $("playShow").textContent = "Tocar nossa música";
  $("songEnding").hidden = false;
  showPhoto(photos.length - 1);
});
song.addEventListener("play", () => { if (startedShow) $("songEnding").hidden = true; });

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
