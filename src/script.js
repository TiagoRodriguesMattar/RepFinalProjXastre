const {ipcRenderer} = require('electron');

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

const Novo_treinamento_button = document.getElementById("Novo_treinamento_button");

if(Novo_treinamento_button){
    Novo_treinamento_button.addEventListener('click', () => {
        try{
            ipcRenderer.send("JanelaCadastro");
        }
        catch(e){console.log(e)}
    });
}



const Novo_quiz = document.getElementById("Novo_quiz");

if(Novo_quiz){
    Novo_quiz.addEventListener('click', () => {
        try{
            ipcRenderer.send("JanelaQuiz");
        }
        catch(e){console.log(e)}
    });
}



const submit_button_treino = document.getElementById("submit_button_treino");

if(submit_button_treino){
    
    
    submit_button_treino.addEventListener('click', (e) => {
        axios.post('https://api-dados.herokuapp.com/login',{
            email: 'b@gmail.com',
            senha: '12345'
        })
      .then((res)=> {
        const token = res.data.accessToken;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.post('http://localhost:3000/auth',{},config).then((res) => {
            console.log(res)
        },(error) => {
            console.log(error);
          })
        
      },(error) => {
        console.log(error);
      })
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
            ipcRenderer.invoke("some-name", cadastro);
        }
        catch{console.log(e);}
    })
}