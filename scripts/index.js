const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const botao_acesso_quiz = document.getElementById('Acessar_quiz');

if(botao_acesso_quiz){
    botao_acesso_quiz.addEventListener('click', () => {
        try{
            if(verificar()){
                axios.post("http://localhost:3000/select_nome_treinos")
                .then((res)=>{
                   console.log(res.body);
                })
                ipcRenderer.send("JanelaAcessoQuiz");
            }
        }
        catch(e){console.log(e)}
    });
}

// funcao para verificar token 
function verificar() {
    var auth = true;
    let token;
    axios.post('https://api-dados.herokuapp.com/login',{email: 'b@gmail.com', password: '12345'})
    .then((res) => {
        token = res.data.accessToken;
        axios.post('http://localhost:3000/auth', {}, {
            headers: {'authorization': `Basic ${token}`}
        })
        .then((res)=>{
            if(res.status === 401) 
                auth = false;
        })
    })
    return auth;
}
//

const Novo_treinamento_button = document.getElementById("Novo_treinamento_button");

if(Novo_treinamento_button){
    Novo_treinamento_button.addEventListener('click', () => {
        try{
            if(verificar())
                ipcRenderer.send("JanelaCadastro");
        }
        catch(e){console.log(e)}
    });
}

const Novo_quiz_button = document.getElementById("Novo_quiz_button");

if(Novo_quiz_button){
    Novo_quiz_button.addEventListener('click', () => {
        try{
            if(verificar())
                ipcRenderer.send("JanelaQuiz");
        }
        catch(e){console.log(e)}
    });
}