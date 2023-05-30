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
            //ipcRenderer.invoke("treino-bd", cadastro);
            axios.post('http://localhost:3000/treinamento',cadastro)
            .then((res) => {
            console.log(res);
            })
        }
        catch{console.log(e);}
    })
}