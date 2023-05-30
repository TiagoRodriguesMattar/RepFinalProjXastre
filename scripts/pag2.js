const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const codigo_treino = document.querySelector('#NomeQuiz');
const PerguntaQuiz = document.querySelector('#PerguntaQuiz');
const RespostaCorreta = document.querySelector('#RespostaCorreta');
const RespostaE1 = document.querySelector('#RespostaE1');
const RespostaE2 = document.querySelector('#RespostaE2');
const RespostaE3 = document.querySelector('#RespostaE3');

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