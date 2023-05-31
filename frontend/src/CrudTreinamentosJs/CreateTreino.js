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

const submit_button_treino = document.getElementById("submit_button_treino");

function verificar() {
    var auth = true;
    //console.log(User)
    //console.log(email_login.value);
    //console.log(password_login.value);
    //token = User.token;
    //console.log(token);
    const user = JSON.parse(localStorage.getItem('user'));

    axios.post('http://localhost:3000/auth', {}, {
        headers: {'authorization': `Basic ${user.token}`}
    })
    .then((res)=>{
        if(res.status === 401) 
            auth = false;
    })
    return auth;
}

if(submit_button_treino){
    submit_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if (verificar()) {
                const cadastro = {
                    codigo: Math.floor(Math.random() * 10000),
                    nome_comercial: nome_comercial.value.toUpperCase(),
                    descricao: descricao.value.toUpperCase(),
                    carga_horaria: carga_horaria.value,
                    inicio_inscricoes: inicio_inscricoes.value,
                    fim_inscricoes: fim_inscricoes.value,
                    inicio_treinamento: inicio_treinamento.value,
                    fim_treinamento: fim_treinamento.value,
                    min_inscritos: min_inscritos.value,
                    max_inscritos: max_inscritos.value,  
                }
                //ipcRenderer.invoke("treino-bd", cadastro);
                axios.post('http://localhost:3000/treinamento', cadastro)
                .then((res) => {
                console.log(res);
                })
            }
        }
        catch{console.log(e);}
    })
}