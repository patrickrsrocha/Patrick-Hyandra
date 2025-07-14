// Frase animada  (parte que já existia – mantida igual)
window.addEventListener('DOMContentLoaded', () => {
  const frase = document.querySelector('.frase');
  frase.style.opacity = '1';
  frase.style.transform = 'translateY(0)';

  /* ------------- CONTADOR DETALHADO ------------- */
  const contadorEl = document.getElementById("contador");
  const inicio = new Date("2024-07-14");

  function atualizarContador() {
    const agora = new Date();
    let diffMs = Math.abs(agora - inicio);
    let diffSegundos = Math.floor(diffMs / 1000);

    const segPorMin = 60;
    const segPorHora = segPorMin * 60;
    const segPorDia = segPorHora * 24;
    const segPorSemana = segPorDia * 7;
    const segPorMes = segPorDia * 30;   // aprox
    const segPorAno = segPorDia * 365;  // aprox

    const anos = Math.floor(diffSegundos / segPorAno); diffSegundos -= anos * segPorAno;
    const meses = Math.floor(diffSegundos / segPorMes); diffSegundos -= meses * segPorMes;
    const semanas = Math.floor(diffSegundos / segPorSemana); diffSegundos -= semanas * segPorSemana;
    const dias = Math.floor(diffSegundos / segPorDia); diffSegundos -= dias * segPorDia;
    const horas = Math.floor(diffSegundos / segPorHora); diffSegundos -= horas * segPorHora;
    const minutos = Math.floor(diffSegundos / segPorMin); diffSegundos -= minutos * segPorMin;
    const segundos = diffSegundos;

    contadorEl.textContent =
      `Estamos juntos há ${anos} ano(s), ${meses} mês(es), ${semanas} semana(s), ${dias} dia(s), ${horas} hora(s), ${minutos} minuto(s) e ${segundos} segundo(s).`;
  }
  atualizarContador();
  setInterval(atualizarContador, 1000);
});

/* ------------- CARTINHA ------------- */
document.getElementById("btn-carta")
  .addEventListener("click", () =>
    document.getElementById("texto-carta").classList.toggle("oculto")
  );

/* ------------- CARROSSEL ------------- */
const imagens = [
  "imagens/foto07.jpg", "imagens/foto05.jpg", "imagens/foto04.jpg",
  "imagens/foto12.jpg", "imagens/foto08.jpg", "imagens/foto09.jpg"
];
let index = 0;
setInterval(() => {
  index = (index + 1) % imagens.length;
  document.getElementById("carrossel-img").src = imagens[index];
}, 3000);

/* ------------- PLAYER ------------- */
const audio = document.getElementById("audio-player");
const volumeControl = document.getElementById("volume");
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");

playBtn.onclick = () => { audio.play(); playBtn.style.display = "none"; pauseBtn.style.display = "inline-block"; };
pauseBtn.onclick = () => { audio.pause(); playBtn.style.display = "inline-block"; pauseBtn.style.display = "none"; };

audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  timer.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});
audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration;
  timer.textContent = `0:00 / ${formatTime(audio.duration)}`;
});
progress.oninput = () => (audio.currentTime = progress.value);

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

/* ====================================================
   ===============  QUIZ INTERATIVO  ===================
   ==================================================== */
const perguntas = [
  {
    pergunta: "Qual o nosso dia mais especial?",
    opcoes: [
      "O dia em que te dei nossa aliança",
      "O dia em que saímos juntos pela 1ª vez 💖",
      "O primeiro dia que você foi na minha casa"
    ],
    correta: 0
  },
  {
    pergunta: "Quem ama mais?",
    opcoes: [
      "Hyandra ama mais o Patrick",
      "Patrick ama mais a Hyandra ❤️"
    ],
    correta: 1 // a segunda opção é a correta
  },
  {
    pergunta: "Qual foi o mês do nosso primeiro beijo?",
    opcoes: ["Agosto", "Julho", "Setembro"],
    correta: 1
  },
  {
    pergunta: "Qual apelido carinhoso mais usamos?",
    opcoes: [
      "Amor",
      "Vida",
      "Meu Bem"
    ],
    correta: 0
  }
];

let indice = 0;
let acertos = 0;

/* -- cria estrutura do quiz se ainda não existir -- */
(() => {
  const sec = document.querySelector(".quiz");
  sec.innerHTML = `
      <h2>💘 Nosso Quiz do Amor 💘</h2>
      <div id="quiz-container">
          <p id="pergunta" class="quiz-pergunta">Carregando pergunta...</p>
          <div id="opcoes"></div>
          <button id="proxima" onclick="proximaPergunta()" style="display:none;">Próxima</button>
          <p id="resultado"></p>
      </div>`;
})();

/* -- funções do quiz -- */
function carregarPergunta() {
  const q = perguntas[indice];

  document.getElementById("pergunta").textContent = q.pergunta;

  const opcoesDiv = document.getElementById("opcoes");
  opcoesDiv.innerHTML = "";

  q.opcoes.forEach((texto, i) => {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.className = "quiz-btn";
    btn.onclick = () => verificarResposta(i, btn);
    opcoesDiv.appendChild(btn);
  });

  document.getElementById("resultado").textContent = "";
  document.getElementById("proxima").style.display = "none";
}

function verificarResposta(escolhida, btnClicado) {
  const correta = perguntas[indice].correta;
  const resultado = document.getElementById("resultado");

  if (escolhida === correta) {
    acertos++;
    resultado.textContent = "Acertou! 🥰";
    resultado.style.color = "lightgreen";
  } else {
    resultado.textContent = `Errado! Era: "${perguntas[indice].opcoes[correta]}" 💔`;
    resultado.style.color = "pink";
    btnClicado.classList.add("errada");        // pinta o escolhido de vermelho
  }

  /* desativa todos os botões */
  document.querySelectorAll(".quiz-btn").forEach(b => b.disabled = true);
  document.getElementById("proxima").style.display = "inline-block";
}

function proximaPergunta() {
  indice++;

  // Verifica se acabou DEPOIS de responder a última corretamente
  if (indice < perguntas.length) {
    carregarPergunta();
  } else {
    setTimeout(() => {
      document.getElementById("quiz-container").innerHTML =
        `<h3>Você acertou ${acertos} de ${perguntas.length} perguntas! ❤️</h3>`;
    }, 300);
  }
}


window.addEventListener("DOMContentLoaded", carregarPergunta);
