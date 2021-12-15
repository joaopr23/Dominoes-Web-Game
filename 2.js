var online = "OFF";
// Para puder fazer enter na password
//acho que podia ter usado form but whatever
//tambem tenho botao para login mas assim é mais pratico
window.addEventListener("load",function(){
var qqcoisa = document.getElementById('password')

// Execute a function when the user releases a key on the keyboard
qqcoisa.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    logIn();
  }
});
});

//RAKING------------------------------------------------------------------------------------
  fetch('http://twserver.alunos.dcc.fc.up.pt:8008/ranking',{
    method: 'POST',

    body: JSON.stringify("{}")
})

  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        for(var i= 0;i<data.ranking.length;i++){
          //console.log(data.ranking[i].nick)

        //funcoes aqui
        var testin = document.createElement("TR");
        var testin2 = document.createElement("TR");
        var agrJaNaoETestin3 = document.createElement("TR");
        var textNode = document.createTextNode(data.ranking[i].nick);
        var vicsNode = document.createTextNode(data.ranking[i].victories);
        var nrJogosNode = document.createTextNode(data.ranking[i].games);
        testin.appendChild(textNode);
        testin2.appendChild(vicsNode);
        agrJaNaoETestin3.appendChild(nrJogosNode);
        document.getElementById("names").appendChild(testin);
        document.getElementById("v1").appendChild(testin2);
        document.getElementById("nr").appendChild(agrJaNaoETestin3);

      }

      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
//-----------------------------------------------------------------------------------------
var vez;
var board;
var eventSource;
var nrPecasMonte;
var gameStart = false;
var nrP2;
var nomeP2;
function update(){
  var gamePos;
  var text2fetch = 'http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=' + nome.value + '&game=' + game
  console.log(text2fetch);
  vencedor  = true;

  eventSource = new EventSource(text2fetch);
  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("entrou no update");

    if(data.winner!=undefined){
      vencedor = false;
      gameStart = false;
      alert("Winner is " + data.winner);
      //ganhou o jogo, temos que limpar a board e os arrays
      document.getElementById("botoesJogo").style.display="none";
      document.getElementById("yourTurn").style.display="none";
      clearData();
      clearBoard();
      //e iniciar os butoes de novo
      document.getElementById("darpecas").disabled = false;
      document.getElementById("botaoOnline").disabled = false;
      document.getElementById('IdOn').style.display= "none";


    }else if(data.board!=undefined){
    //console.log(data.turn + "<--");
    jogo = [];
    for( i = 0; i < data.board.line.length ;i++ ){
      ColocarNoJogo(new Peca(data.board.line[i][0],data.board.line[i][1]));
    }
    board = data.board.line;
    console.log(board + " aqui esta a board")
    nrPecasMonte = data.board.stock;
    console.log("Tem " +nrPecasMonte + " pecas no monte")
    if(gameStart==false){
      //alert("Emparelhou com outro jogador");
      document.getElementById("loading").style.display="none";
      nrP2 = 7;
      gameStart=true;
      document.getElementById("yourTurn").style.display = 'block';
      //aqui é que o gif de loading sai
      //tirar o alerta
      //meter o "Game ID:" += game (ou game.value ou game.text ou o crlh)
      //meter o nome do adversario
    }

    nrP2 = 28 - data.board.stock - data.board.count[nome.value] - data.board.line.length;
    pecasP2 = [];
    for(var i=0;i<nrP2;i++){pecasP2.push(new Peca(0,0));}
    darPecasP1();
    darPecasP2();
    mostrarJogo();
    vez = data.turn;
    console.log("user: ||" + vez + "||é o proximo a jogar");

    if(vez==nome.value){
      document.getElementById("yourTurn").innerHTML = "[" + String.fromCodePoint(9989) +"] Your Turn ["+ String.fromCodePoint(9989) +"]"
      document.getElementById("yourTurn").style.background = "lime"
      //alert("It's your turn to play");
      //tratar aqui da vez!

      //loading gif off (HIDE) waiting for oponent gif (caga talvez)

    }else{
      nomeP2 = nome.value;
      //meter aqui a checkbox do adversario a aparecer
      //else loading gif on
      document.getElementById("yourTurn").innerHTML = "[" + String.fromCodePoint(10060) +"] " +vez + "'s Turn ["+ String.fromCodePoint(10060) +"]"

      document.getElementById("yourTurn").style.background = "red"
    }


    }
 }


}

//----------------------------------------------------------------------------------
function efeito(i){
  setTimeout(function(){document.getElementById(i).style.opacity = 0.2;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.4;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.6;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.8;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.6;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.4;},100);
  setTimeout(function(){document.getElementById(i).style.opacity = 0.2;},100);
  document.getElementById(i).style.background = 'none';
  setTimeout(function(){document.getElementById(i).style.opacity = 1;},100);

}
var onde = "start";
function jogaPecaOnline(i){

  if(vez==nome.value){

    var banana = [pecasP1[i].y,pecasP1[i].x]
    console.log(banana);
      if( banana[0]!=esq && banana[0]!=dir && banana[1]!=esq && banana[1]!=dir && jogo.length!= 0){
        //alert("Não é possivel jogar essa peça, tente outra ou vá ao monte buscar");
        document.getElementById(i).style.background = 'red';
     setTimeout(function(){efeito(i)},1000);
      }else{
        onde = "start";
         if((banana[0]==esq && banana[0]==dir)
            || (banana[1]==esq && banana[1]==dir)
            || (banana[0]==esq && banana[1]==dir)
            || (banana[1]==esq && banana[0]==dir) ){

        var xx = confirm("Place piece at start?")
        if(xx==true){onde = "start";}else{onde = "end";}


        console.log(texto4);


      }else if(banana[0]==dir || banana[1]==dir) {onde = "end";}



      var texto4 = {"nick": nome.value, "pass": password.value, "game": game, "piece": banana , "side": onde}

      fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify',{
        method: 'POST',

        body: JSON.stringify(texto4)
      })

      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
              alert(response.text);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {

            if(data.error){
                alert(data.error);
            }else{
                console.log(JSON.stringify(data) + "<-- se estiver vazio a peca foi jogada");
                if(JSON.stringify(data)=="{}"){
                    console.log("peça jogada");
                    yourTurn = false;
                    pecasP1.splice(i,1);
                    darPecasP1();
                }

            }

          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });


    }


  }else alert("Not your Turn to play");
}


function ObterPeca(){
  if(vez==nome.value){
    if(nrPecasMonte!=0){
      var texto4 = {"nick": nome.value, "pass": password.value, "game": game, "piece": null}
      console.log(texto4);
      fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify',{
        method: 'POST',

        body: JSON.stringify(texto4)
      })

      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
              //alert(response.text);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {

            if(data.error){
                alert(data.error);
            }else{
              console.log(JSON.stringify(data) + " esta aqui nada provavelmente");
              console.log(data.piece);
              pecasP1.push(new Peca(data.piece[1],data.piece[0]));
              darPecasP1();
            }

          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

    }else alert("Não há peças no monte, se não tiver nenhuma peça que encaixe terá que passar a vez");

  }


}
//----------------------------------------------------------------------------------
function leaveGame(){
  var texto3 = {"nick": nome.value, "pass": password.value, "game": game}
  console.log(texto3);
  fetch('http://twserver.alunos.dcc.fc.up.pt:8008/leave',{
    method: 'POST',

    body: JSON.stringify(texto3)
  })

  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
          alert(response.text);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        //eventSource.close();
        console.log(JSON.stringify(data) + "--> vazio = logout with sucess");
        eventSource.close();
        online = "OFF";
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });


}
//----------------------------------------------------------------------------------
var game;
function joinGame(){
  if(fezLogin == true){
    var texto2 = {"group": "RapaTachos", "nick": nome.value, "pass": password.value }
    console.log(texto2);
  // TODO:: METER GIF DO LOADING
   var timer = setInterval(function(){


     fetch('http://twserver.alunos.dcc.fc.up.pt:8008/join',{
       method: 'POST',

       body: JSON.stringify(texto2)
     })

     .then(
       function(response) {
         if (response.status !== 200) {
           console.log('Looks like there was a problem. Status Code: ' +
             response.status);
             //alert(response.text);
           return;
         }

         // Examine the text in the response
         response.json().then(function(data) {
           if(data.hand)
              clearInterval(timer);
           //alert("entrou no jogo");

           document.getElementById("loading").style.display="block";
           // TO DO:: LIMPAR GIF DO LOADING // meter aqui o gif
           console.log(JSON.stringify(data) + " esta aqui o game");
           console.log(JSON.stringify(data.hand) + " esta aqui a mão");
           document.getElementById("darpecas").disabled = true;
           document.getElementById("botaoOnline").disabled = true;
           game = data.game;
           document.getElementById('gameId').innerHTML = game;
           document.getElementById('IdOn').style.display= "block";
           document.getElementById('gameIdTitle').style.display= "block";
          document.getElementById('gameId').style.display= "block";
           startGame(data.hand);
           online = "ON";

         });
       }
     )
     .catch(function(err) {
       console.log('Fetch Error :-S', err);
     });
   },1000);

 }else alert("Para jogar Online 1º tem que fazer Login");

}

function startGame(mao){
  if(mao!= null){
    pecasP1 = [];
    for(let i=0;i<mao.length;i++){
      console.log(mao[i]);
      pecasP1.push(new Peca(mao[i][1],mao[i][0]))
    }
    darPecasP1();
    update();
    document.getElementById("botoesJogo").style.display = "block";

  }

}
//----------------------------------------------------------------------------------
var fezLogin = false;
function logIn(){

  var nome = window.document.getElementById('nome')
  var password = window.document.getElementById('password')
  //console.log(nome.value);
  //console.log("User: " +nome.value);
  //console.log("Password: " +password.value);
  var texto ={"nick": nome.value, "pass": password.value}
console.log(texto)
  fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register',{
    method: 'POST',

    body: JSON.stringify(texto)
  })

  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
      }

      // Examine the text in the response
      response.json().then(function(data) {
        if(data.error){
            alert(data.error);
        }else {
          console.log(JSON.stringify(data) + " se estiver vazio é porque entrou ^_^");
          fezLogin = true;
          document.getElementById("apaga").style.display = "none";
          document.getElementById("logout").style.display = "block";
          document.getElementById("nomeUtilizador").innerHTML="Utilizador: " + nome.value;
          // var vid = document.getElementById("player");
          // vid.play();
        }
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}


//-------------------------------------------------------------
function logout(){
  //document.location.reload();
  // Esta bomba aqui em cima simplificava-me o trabalho todo, but well...

  document.getElementById("apaga").style.display = "block";
  document.getElementById("nomeUtilizador").innerHTML="Autenticação:";
  document.getElementById("logout").style.display = "none";
  document.getElementById("loading").style.display = "none";
  ProcedimentosFim(0);
  fezLogin = false;

}
//---------------------------------------------------------------------------------
function FirstToPlay (){
  var maiorp1 = 0
  var maiorp2 = 0
  for(let index = 0 ; index < 7 ; index++){
    if (((pecasP1[index].x) + pecasP1[index].y) > maiorp1)
      maiorp1 = pecasP1[index].x + pecasP1[index].y
  }
  for(let index = 0 ; index < 7 ; index++ ){
    if ((pecasP2[index].x + pecasP2[index].y) > maiorp2)
    maiorp2 = pecasP2[index].x + pecasP2[index].y
  }
  if (maiorp1>maiorp2){
    return 1;
  }
  else {
    return 2;
  }
}

function canPlay(player){
  if(player == "P1"){
    for(let i=0; i<pecasP1.length;i++){
      if(esq == pecasP1[i].x || esq == pecasP1[i].y){return true;}
      if(dir == pecasP1[i].x || dir == pecasP1[i].y){return true;}
    }
    return false;
  }
  if(player == "P2"){
    for(let i=0; i<pecasP2.length;i++){
      if(esq == pecasP2[i].x || esq == pecasP2[i].y){return true;}
      if(dir == pecasP2[i].x || dir == pecasP2[i].y){return true;}
    }
    return false;
  }
}

function jogaPecaP1(index){
  if(ColocarNoJogo(pecasP1[index])!=-1){
  console.log(jogo)
  //let banana = pecasP1[index];
  //antes deste splice tenho que usar o pecasP1[index]
  pecasP1.splice(index,1);

  darPecasP1();
  setTimeout(mostrarJogo,500);

  //console.log("P2" + canPlay("P2"));
  var start = new Date().getTime();

    canPlay(P2);
    setTimeout(botP2,1000);

  //console.log("P1" + canPlay("P1"));

  }else{
    alert("Não é possivel Jogar a peça, tente outra")}
}
function IrAoMonte(){
  if(online=="OFF"){
  pecasP1.push(todasPecas.splice(Math.floor(Math.random()*todasPecas.length-1),1).pop());
  darPecasP1()
 }else{
   ObterPeca();
 }
}

function jogaPecaP2(p,i){
  if(ColocarNoJogo(p)!=-1){
  console.log(jogo);
  pecasP2.splice(i,1);



  darPecasP2();
  mostrarJogo();

}else{alert("Não é possivel jogar a peça, tente outra")}
}

function botP2(){
  if(jogo.length==0) {
    var pec = Math.floor(Math.random() * 6)
    jogaPecaP2(pecasP2[pec],pec)
    return
  }
  while(canPlay("P2")==false){pecasP2.push(todasPecas.splice(Math.floor(Math.random()*todasPecas.length-1),1).pop()); darPecasP2(); canPlay("P2");}
  for(let i=0;i<pecasP2.length;i++){
    if((esq == pecasP2[i].x) || (esq == pecasP2[i].y) || (dir == pecasP2[i].x) || (dir == pecasP2[i].y)){

      jogaPecaP2(pecasP2[i],i);
      console.table(pecasP1);
      console.table(pecasP2);
      break;
    }
  }
  console.log(todasPecas.length);
}
  //se acabar este ciclo for ganhamos ao computador yeay +1 :D







function darPecas(game,gamePos){
  if(online=="OFF"){clearBoard();};

  document.getElementById("darpecas").disabled = true;
  document.getElementById("botaoOnline").disabled = true;
  document.getElementById("botoesJogo").style.display = "block";
  novasPecas();
  darPecasP1();
  darPecasP2();
  if(FirstToPlay()==2) botP2();

  //ELSE
  //fazer aqui o dar pecas ONLINE
}
function darPecasP1(){
  var el = document.getElementById("P1");
  while ( el.firstChild ) el.removeChild( el.firstChild );
  for(let index = 0; index<pecasP1.length;index++){
    var div1 = document.createElement("div");
    div1.setAttribute("id",index);

    var a = document.getElementById("P1");
    var x = document.createTextNode(String.fromCodePoint(pecasP1[index].txt)) ;
    div1.appendChild(x);
    a.appendChild(div1);

    document.getElementById(index).addEventListener("click",function(){
      if(online=="ON"){
          jogaPecaOnline(index);
      }else jogaPecaP1(index);
    });

      //novo
      document.getElementById(index).addEventListener("mouseover",function(){
        //document.getElementById(index).firstElementChild.style.height = "200px"
        document.getElementById(index).style.fontSize = "200%"
      });
      document.getElementById(index).addEventListener("mouseout",function(){
        document.getElementById(index).style.fontSize = "100%"

      });

  }
}
function darPecasP2(){
  var el = document.getElementById("P2");
  while ( el.firstChild ) el.removeChild( el.firstChild );


  for(let i = 0; i<pecasP2.length;i++){
    var div2 = document.createElement("div");
    div2.setAttribute("id",(i+1)*100);

    var b = document.getElementById("P2");
    var y = document.createTextNode(String.fromCodePoint(127024)) ;
    div2.appendChild(y);
    b.appendChild(div2);
    //document.getElementById((i+1)*100).addEventListener("click",function(){jogaPecaP2(pecasP2[i],i);});

  }
}

function mostrarJogo(){
  if(jogo.length>=3){
    document.getElementById("jogo").style.fontSize="130%";
  }
  else if(jogo.length>=5){
    document.getElementById("jogo").style.fontSize="120%"
  }
  else if(jogo.length>=7){
    document.getElementById("jogo").style.fontSize="90%"
  }
  else if(jogo.length>=10){
    document.getElementById("jogo").style.fontSize="60%"
  }
  else if(jogo.length>=12){
    document.getElementById("jogo").style.fontSize="40%"

  }
  else if(jogo.length>=15){
    document.getElementById("jogo").style.fontSize="20%"
  }
  else if(jogo.length>=20){
    document.getElementById("jogo").style.fontSize="15%"
  }
  else if(jogo.length>=25){
    document.getElementById("jogo").style.fontSize="10%"
  }
  var el = document.getElementById("jogo");
  while ( el.firstChild ) el.removeChild( el.firstChild );

  for(let index = 0; index<jogo.length;index++){
    var div1 = document.createElement("div");
    div1.setAttribute("id",(index+1)*10000);

    var a = document.getElementById("jogo");
    var x = document.createTextNode(String.fromCodePoint(jogo[index].txt)) ;
    div1.appendChild(x);
    a.appendChild(div1);
  if(online == 'OFF' )
    if(WhoWins()==1 || WhoWins()==2) ProcedimentosFim(WhoWins())

  }
}
var v1 = 0
var v2 = 0
var d = 0
//document.getElementById('v1').innerHTML = v1;
function ProcedimentosFim(player){
  var bleble = confirm("Are you sure you want to leave?");
  if(bleble == true){
    if(online == "ON"){
      leaveGame();
    }else{
      if(player==1){
         window.alert("Parabéns, Ganhou o Jogo!");
         v1++}
      if(player==2){
         window.alert("O Jogador 2 Ganhou o Jogo!");
         v2++}
      //if(player==0) window.alert("Desistiu do jogo")
    }

    document.getElementById("darpecas").disabled = false;
    document.getElementById("botaoOnline").disabled = false;
    clearData();
    clearBoard();
    var el = document.getElementById("P1");
    while ( el.firstChild ) el.removeChild( el.firstChild );
    var el = document.getElementById("P2");
    while ( el.firstChild ) el.removeChild( el.firstChild );
    var el = document.getElementById("jogo");
    while ( el.firstChild ) el.removeChild( el.firstChild );
    document.getElementById('v1').innerHTML = v1;
    //document.getElementById('v2').innerHTML = v2;
    //if(player==1 || player==2) ProcedimentosFim(0) // acho que posso comentar isto
    document.getElementById("botoesJogo").style.display="none";
    document.getElementById("yourTurn").style.display="none";
    document.getElementById("darpecas").disabled = false;
    document.getElementById("botaoOnline").disabled = false;
  }
}
function clearData(){
  //limpar os arrays
  while(pecasP1.length > 0) {
    pecasP1.pop();
  }
  while(pecasP2.length > 0) {
  pecasP2.pop();
  }
  while(jogo.length > 0) {
    jogo.pop();
  }
  while(todasPecas.length > 0){
    todasPecas.pop();
  }
}

function clearBoard(){
  var el = document.getElementById("P1");
  while ( el.firstChild ) el.removeChild( el.firstChild );
  var el = document.getElementById("P2");
  while ( el.firstChild ) el.removeChild( el.firstChild );
  var el = document.getElementById("jogo");
  while ( el.firstChild ) el.removeChild( el.firstChild );
  //document.getElementById("darpecas").disabled = false;
  document.getElementById('v1').innerHTML = v1;
}

function ColocarNoJogo(p){
  if(p.x==p.y){
      p.txt = 127075 + p.x*7 + p.y;
  }

  if(jogo.length<1){
    jogo.push(p);esq=p.x;dir=p.y;
  }else{
    //falta o caso quando se pode jogar dos 2 lados
    if(dir==p.x){
      dir=p.y;jogo.push(p);
    }
    else if(esq==p.y){esq=p.x;jogo.unshift(p);}
    else if(dir==p.y){
      dir=p.x;
      p.txt = 127025 + p.y*7 + p.x;
      jogo.push(p);
    }
    else if(esq==p.x){
      esq=p.y;
      p.txt = 127025 + p.y*7 + p.x;
      jogo.unshift(p);
    }

    else return -1;
    //falta acabar este ultimo else
    //que é caso não de para jogar a peça dar um alerta

  }
  console.log(esq + "<<Esq");
  console.log(dir + "<<Dir");


  //console.log(p);
}

var todasPecas = [];
var pecasP1 = [];
var pecasP2 = [];
var jogo = [];
var esq,dir;
var indexP1;
var indexP2;

class Peca{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.txt = (127025 + (this.x*7) + (this.y))

  }
}
function novasPecas (){
for(let i=0; i<7;i++){
  for(let j=i;j<7;j++){
    todasPecas.push(new Peca(i,j));

  }
}
function novasPecasv1 (pecas){
  for(let i=0; i<pecas.length;i++){
      todasPecas.push(new Peca(pecas[i][0],pecas[i][1]));
  }

}
//console.log(todasPecas[0].txt);
for(let i=0; i<7;i++){
  console.log()
    pecasP1.push(todasPecas.splice(Math.floor(Math.random()*todasPecas.length-1),1).pop());
    pecasP2.push(todasPecas.splice(Math.floor(Math.random()*todasPecas.length-1),1).pop());
    //  console.log(todasPecas.length);
}
console.log(pecasP1);
console.log(pecasP2);
console.log(todasPecas);
console.log(todasPecas.length);
console.log(jogo);

console.log("player" + FirstToPlay() + " is 1st to play");
}


function JogoFechado(){
  var count = 0;
  if(jogo[0].x==jogo[jogo.length-1]){
    for(let i = 0 ; i < pecasP1.length ; i++){
      if(pecasP1[i].x==jogo[0]) count++
      if(pecasP1[i].y==jogo[0]) count++
    }
    for(let i = 0 ; i < pecasP2.length ; i++){
      if(pecasP2[i].x==jogo[0]) count++
      if(pecasP2[i].y==jogo[0]) count++
    }
    if(count==7) return true
    }
  return false;
}

  function WhoWins(){
  if(pecasP1.length==0) return 1;
  if(pecasP2.length==0) return 2;
  if(JogoFechado()){
    var pontos1 = 0
    var pontos2 = 0
    for(let i = 0 ; i < pecasP1.length ; i++){
      pontos1 = pontos1 + pecasP1[i].x + pecasP1[i].y
    }
    for(let i = 0 ; i < pecasP2.length ; i++){
      pontos2 = pontos2 + pecasP2[i].x + pecasP2[i].y
    }
    if(pontos1<porntos2) return 1
    else return 2
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function passarVez(){
  if(online=="OFF"){botP2();}else{
    if(nrPecasMonte == 0 && canPlay("P1")==false){
      var texto5 = {"nick": nome.value, "pass": password.value, "game": game, "skip": null}

      fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify',{
        method: 'POST',
        body: JSON.stringify(texto5)
      }).then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
              alert(response.text);
            return;
          }
          // Examine the text in the response
          response.json().then(function(data) {
            if(data.error){
                alert(data.error);
            }
            console.log(data);
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }else if(vez == nome.value){alert("Não é possivel passar a vez, exprimente jogar uma peça, ou então ir buscar ao monte");}
    else alert("Not your turn to play");
  }
}
