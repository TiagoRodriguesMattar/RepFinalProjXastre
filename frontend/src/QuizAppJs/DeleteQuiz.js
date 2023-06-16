const axios = require('axios');
const { response } = require('express');
const {ipcRenderer} = require('electron');

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

const DeleteQuizAdm = document.querySelector(".DeleteQuizAdm");

function displayQuiz(obj) {
    DeleteQuizAdm.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do Quiz</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].NomeQuiz}</th>
                </tr>
            <tbody>

            </table>`;
            DeleteQuizAdm.appendChild(div);
        }
}

const ViewQuizzes_button = document.getElementById('ViewQuizzes');

if (ViewQuizzes_button) {
    ViewQuizzes_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/VerAllQuiz')
                .then(response => {
                    displayQuiz(response.data)
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

function updateOption(select){
    axios.get('http://localhost:3000/VerAllQuiz')
                .then(response => {
                    const obj = response.data;
            for(let i=0;i<select.length;i++){
                select.options.remove(0)
            }
            for(let i=0; i<obj.length;i++){
                var c = document.createElement("option");
                c.value = `${obj[i].NomeQuiz}`;
                c.text = obj[i].NomeQuiz;
                select.options.add(c,i);
        }
                })
}

const QuizTitle = document.querySelector('#QuizTitle');

updateOption(QuizTitle);
const delete_button_quiz = document.getElementById('delete_button_quiz');

if (delete_button_quiz) {
    delete_button_quiz.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                const obj = {
                    Nome: QuizTitle.value.toUpperCase(),
                }
                axios.post('http://localhost:3000/DeleteQuiz', obj);
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarCrudQuiz_button = document.getElementById("VoltarCrudQuiz");

if(VoltarCrudQuiz_button) { 
    VoltarCrudQuiz_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud_quiz');
        }
        catch{
            console.log(e);
        }
    })
}