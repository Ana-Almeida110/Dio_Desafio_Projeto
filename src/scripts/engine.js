/*variaveis */
const state = { 
  view: { //variável que manipula algo visual
    squares: document.querySelectorAll(".square"), //propriedade da classe
    enemy: document.querySelector(".enemy"), //propriedade da classe
    timeLeft: document.querySelector("#time-left"), //propriedade do id
    score: document.querySelector("#score"), //propriedade di id
  },
  values: { //variável utilizadas para coisas não visual
    gameVelocity: 1000, //velocidade 
    hitPosition: 0, //propriedade que indica a posição do inimigo
    result: 0, //guarda a pontuação geral
    curretTime: 30, //armazena o tempo
    ranking: [], 
  },
  actions: {
    timerId: null,
    countDownTimerId: null,//dispara o contador do timer 
  },  
};

const btnStart = document.getElementById("start-game");
const btnExit = document.getElementById("exit-game");

//exibe o alerta assim que a página carrega
window.onload = () => {
  alert("O jogo está pronto! Clique em 'Iniciar' para começar.");
};

//adiciona o evento de clique para o botão "Iniciar"
btnStart.addEventListener("click", () => {  
  resetGame(); //reseta o jogo antes de iniciar
  initialize();//inicia após o clique do botão   
});

//adiciona o evento de clique para o botão "Sair"
btnExit.addEventListener("click", () => {
  clearInterval(state.actions.timerId); //para o timer de quadrado aleatório
  clearInterval(state.actions.countDownTimerId); //para o timer de contagem regressiva
  alert("Você saiu do jogo. Até mais!"); //mensagem de saída
  window.location.reload(); //recarrega a página
});

function countDown() { //decrementa o valor
  state.values.curretTime--; //decrementa o tempo
  state.view.timeLeft.textContent = state.values.curretTime;//atualiza o timer

  if (state.values.curretTime <= 0) { //verifica se o tempo acabou
    clearInterval(state.actions.countDownTimerId); //
    clearInterval(state.actions.timerId);

    // Adiciona o resultado ao ranking
    state.values.ranking.push(state.values.result);

    // Mantém apenas as últimas 4 pontuações
    if (state.values.ranking.length > 4) {
      state.values.ranking.shift(); //remove o mais antigo
    }
    displayRanking();

    alert("Game Over! O seu resultado foi: " + state.values.result);
  }
}   

function playSound(audioName) { //toca o áudio
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2; //diminui o volume do som
  audio.play();
}

function randomSquare() { //função que sorteia um quadrado com o inimigo
  state.view.squares.forEach((square) => { //verifica se o quadrado tem o inimigo
    square.classList.remove("enemy"); //limpa o quadrado q estiver com o inimigo
  });

  let randomNumber = Math.floor(Math.random() * 25); //cria numero aleatório pegando apenas a parte inteira
  let randomSquare = state.view.squares[randomNumber]; //pega o view do state
  randomSquare.classList.add("enemy"); //adiciona a classe
  state.values.hitPosition = randomSquare.id; //guarda o índice do inimigo
}

function addListenerHitBox() { //função q adiciona evento de clique
  state.view.squares.forEach((square) => { //para cada quadradinho, verifica se o id do square do inimigo
    square.addEventListener("mousedown", () => { //adicona um evento que escuta o clique
      if (square.id === state.values.hitPosition) { //compara se o quadrado clicado é o mesmo do inimigo
        state.values.result++; //guarda o resultado incrementando
        state.view.score.textContent = state.values.result; //altera o valor do score (pontuação)
        state.values.hitPosition = null; //impede que o usuário fique clicando no mesmo lugar em loop
        playSound("hit");
      }
    });
  });
}

function displayRanking() {
  //Verifica se já existe uma área para o ranking; se não, cria uma
  const rankingList = document.querySelector("#ranking-list"); //Seleciona a lista
  rankingList.innerHTML = ""; //Limpa o conteúdo anterior
  
  state.values.ranking.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Jogo ${index + 1}: ${score} pontos`;
    rankingList.appendChild(listItem);
  });
}

function resetGame() {
  //limpa os intervalos existentes
  clearInterval(state.actions.timerId);
  clearInterval(state.actions.countDownTimerId);
  
  // reinicia as variáveis de estado
  state.values.curretTime = 30; //tempo inicial
  state.values.result = 0; //pontuação inicial
  state.view.timeLeft.textContent = state.values.curretTime; //atualiza o tempo no display
  state.view.score.textContent = state.values.result; //Atualiza a pontuação no display

  // reinicia os intervalos
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000)
}

function initialize() { //função de início
  addListenerHitBox();  
}



