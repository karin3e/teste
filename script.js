// Exibe o site somente em telas estreitas, para uso no celular.
function checkMobileOnly() {
  const isMobileWidth = window.matchMedia('(max-width: 760px)').matches;
  document.body.classList.toggle('desktop-blocked', !isMobileWidth);
}
checkMobileOnly();
window.addEventListener('resize', checkMobileOnly);

const giftButton = document.getElementById('giftButton');
const surpriseMessage = document.getElementById('surpriseMessage');
const loveRain = document.getElementById('loveRain');
const moreLove = document.getElementById('moreLove');

function makeLoveRain(amount = 24) {
  const bits = ['EU TE AMO', 'K + M', 'MO', 'EU TE AMO'];
  for (let i = 0; i < amount; i++) {
    const bit = document.createElement('span');
    bit.className = 'love-bit';
    bit.textContent = bits[Math.floor(Math.random() * bits.length)];
    bit.style.left = Math.random() * 100 + '%';
    bit.style.animationDelay = Math.random() * 1.2 + 's';
    bit.style.fontSize = (Math.random() * .5 + .8) + 'rem';
    loveRain.appendChild(bit);
    setTimeout(() => bit.remove(), 4200);
  }
}

giftButton.addEventListener('click', () => {
  giftButton.classList.add('open');
  surpriseMessage.classList.add('show');
  makeLoveRain(30);
  giftButton.setAttribute('aria-label', 'Caixa surpresa aberta');
});

moreLove.addEventListener('click', () => {
  const messages = [
    'Eu te amo, Mo. Muito.',
    'Só para deixar registrado: eu te amo.',
    'Ainda sou eu aqui, te lembrando que tu é especial.',
    'Pronto, agora tu já sabe mais uma vez.'
  ];
  moreLove.textContent = messages[Math.floor(Math.random() * messages.length)];
  makeLoveRain(18);
});

const reasons = [
  'Porque tu merece ser lembrada de que é amada, inclusive nos dias difíceis.',
  'Porque ninguém no mundo é exatamente igual a ti.',
  'Porque eu gosto do teu jeito e de quem tu é.',
  'Porque quero estar do teu lado sem tu precisar fingir que está tudo bem.',
  'Porque fofoca nenhuma define quem tu é.',
  'Porque eu escolho tu, Mo.',
  'Porque tu é importante para mim.',
  'Porque é tu. Sempre vai ser tu.'
];
document.getElementById('randomReason').addEventListener('click', () => {
  const result = document.getElementById('randomResult');
  result.textContent = reasons[Math.floor(Math.random() * reasons.length)];
  result.animate([{opacity:0, transform:'translateY(8px)'},{opacity:1, transform:'translateY(0)'}], {duration:350});
});

const moodMessages = {
  sad: 'Mo, eu sei que tem dias que pesam mais. Tu não precisa resolver tudo agora nem fingir que está bem. Queria poder te dar um abraço. Eu te amo e estou do teu lado.',
  angry: 'Tu tem direito de ficar chateada. Só não deixa isso tomar toda a tua paz. O que falam não muda quem tu é, e tu não precisa carregar tudo sozinha.',
  insecure: 'Queria que tu conseguisse se enxergar com um pouco da confiança que eu tenho em ti. Tu é linda, especial e não precisa ser perfeita para ser amada.',
  hug: 'Considera isso um abraço meu. Sem precisar explicar nada, sem precisar falar nada. Só um abraço apertado e a lembrança de que eu me importo contigo.'
};
document.querySelectorAll('[data-mood]').forEach(button => {
  button.addEventListener('click', () => {
    const response = document.getElementById('moodResponse');
    response.textContent = moodMessages[button.dataset.mood];
    response.animate([{opacity:0,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}],{duration:300});
  });
});

document.getElementById('finalButton').addEventListener('click', () => {
  document.getElementById('finalNote').textContent = 'É tu, Mo. Eu te amo e isso não muda por causa do que falam. — Karine';
  makeLoveRain(24);
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));


// Apresentação de fotos da nossa música
const memoryPhotos = ['foto-01.jpeg', 'foto-02.jpeg', 'foto-03.jpeg', 'foto-04.jpeg', 'foto-05.jpeg', 'foto-06.jpeg', 'foto-07.jpeg', 'foto-08.jpeg', 'foto-09.jpeg', 'foto-10.jpeg'];
let memoryIndex = 0;
const memoryPhoto = document.getElementById('memoryPhoto');
const photoCounter = document.getElementById('photoCounter');
function showMemoryPhoto(nextIndex) {
  memoryIndex = (nextIndex + memoryPhotos.length) % memoryPhotos.length;
  memoryPhoto.style.opacity = '0';
  window.setTimeout(() => {
    memoryPhoto.src = memoryPhotos[memoryIndex];
    photoCounter.textContent = `${memoryIndex + 1} / ${memoryPhotos.length}`;
    memoryPhoto.style.opacity = '1';
  }, 160);
}
document.getElementById('prevPhoto').addEventListener('click', () => showMemoryPhoto(memoryIndex - 1));
document.getElementById('nextPhoto').addEventListener('click', () => showMemoryPhoto(memoryIndex + 1));
// Troca automática enquanto a música está tocando.
const ourSong = document.getElementById('ourSong');
let slideshowTimer = null;
ourSong.addEventListener('play', () => {
  if (slideshowTimer) return;
  slideshowTimer = window.setInterval(() => showMemoryPhoto(memoryIndex + 1), 3500);
});
function stopSlideshow() { if (slideshowTimer) { clearInterval(slideshowTimer); slideshowTimer = null; } }
ourSong.addEventListener('pause', stopSlideshow);
ourSong.addEventListener('ended', stopSlideshow);

// Mini game de toque para marcar pontos.
let gameScore = 0;
const gameMessages = ['KKKK pode descontar mais um pouco.', 'Ei, Mo, pega leve comigo!', 'Mais um ponto pra tu.', 'Pronto, já tá melhor?'];
document.getElementById('gameTarget').addEventListener('click', () => {
  gameScore++;
  document.getElementById('gameScore').textContent = gameScore;
  document.getElementById('gameMessage').textContent = gameMessages[Math.floor(Math.random() * gameMessages.length)];
});
document.getElementById('resetGame').addEventListener('click', () => {
  gameScore = 0;
  document.getElementById('gameScore').textContent = '0';
  document.getElementById('gameMessage').textContent = 'Pontuação zerada. Pode começar de novo.';
});
