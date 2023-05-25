const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const nome_comercial = document.querySelector('#nome_comercial');
const descricao = document.querySelector('#descricao');
const carga_horaria = document.querySelector('#carga_horaria');
const inicio_inscricoes = document.querySelector('#inicio_inscricoes');
const fim_inscricoes = document.querySelector('#fim_inscricoes');
const inicio_treinamento = document.querySelector('#inicio_inscricoes');
const fim_treinamento = document.querySelector('#fim_inscricoes');
const min_inscritos = document.querySelector('#min_inscritos');
const max_inscritos = document.querySelector('#max_inscritos');

const codigo_treino = document.querySelector('#NomeQuiz');
const PerguntaQuiz = document.querySelector('#PerguntaQuiz');
const RespostaCorreta = document.querySelector('#RespostaCorreta');
const RespostaE1 = document.querySelector('#RespostaE1');
const RespostaE2 = document.querySelector('#RespostaE2');
const RespostaE3 = document.querySelector('#RespostaE3');

const botao_quiz1 = document.getElementById("quiz1");

if(botao_quiz1){
    botao_quiz1.addEventListener('click', () => {
        try{
            var quiz;
            if(verificar()){
                axios.post("http://localhost:3000/select_quiz",BuscaQuiz)
                .then((res)=>{
                   quiz = res.body
                })
                console.log(quiz);
                // aba pra selecionar a resposta
            }
                
        }
        catch(e){console.log(e)}
    });
}

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

const submit_button_treino = document.getElementById("submit_button_treino");

if(submit_button_treino){
    
    submit_button_treino.addEventListener('click', (e) => {
        console.log("entrou");
        e.preventDefault();
        try{
            const cadastro = {
                codigo: Math.floor(Math.random() * 10000),
                nome_comercial: nome_comercial.value,
                descricao: descricao.value,
                carga_horaria: carga_horaria.value,
                inicio_inscricoes: inicio_inscricoes.value,
                fim_inscricoes: fim_inscricoes.value,
                inicio_treinamento: inicio_treinamento.value,
                fim_treinamento: fim_treinamento.value,
                min_inscritos: min_inscritos.value,
                max_inscritos: max_inscritos.value,  
            }
            ipcRenderer.invoke("treino-bd", cadastro);
        }
        catch{console.log(e);}
    })
}


const submit_button_quiz = document.getElementById("submit_button_quiz");

if(submit_button_quiz){
        
    submit_button_quiz.addEventListener('click', (e) => {
        console.log("entrou");
        e.preventDefault();
        try{
            const InfoQuiz = {
                codigo: Math.floor(Math.random() * 10000),
                codigo_treino: codigo_treino.value,
                PerguntaQuiz: PerguntaQuiz.value,
                RespostaCorreta: RespostaCorreta.value,
                RespostaE1: RespostaE1.value,
                RespostaE2: RespostaE2.value,
                RespostaE3: RespostaE3.value,  
            }
            ipcRenderer.invoke("quiz-bd", InfoQuiz);
        }
        catch{console.log(e);}
    })
    
}