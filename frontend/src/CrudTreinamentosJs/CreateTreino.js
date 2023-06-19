const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const nome_comercial = document.querySelector('#nome_comercial');
const descricao = document.querySelector('#descricao');
const carga_horaria = document.querySelector('#carga_horaria');
const inicio_inscricoes = document.querySelector('#inicio_inscricoes');
const fim_inscricoes = document.querySelector('#fim_inscricoes');
const inicio_treinamento = document.querySelector('#inicio_treinamento');
const fim_treinamento = document.querySelector('#fim_treinamento');
const min_inscritos = document.querySelector('#min_inscritos');
const max_inscritos = document.querySelector('#max_inscritos');
const Curso1_text = document.querySelector('#Curso1text');
const Curso2_text = document.querySelector('#Curso2text');

const QuizAptidao = document.querySelector('#QuizAptidao');
const Case1 = document.querySelector('#Case1');
const Case2 = document.querySelector('#Case2');

const submit_button_treino = document.getElementById("submit_button_treino");

const printStatus = document.querySelector('.printStatus');

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

const ViewQuizAdm = document.querySelector(".ViewQuizAdm");

function displayQuiz(obj) {
    ViewQuizAdm.innerHTML = "";
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
            ViewQuizAdm.appendChild(div);
        }
}

const VerAllQuiz_button = document.getElementById('VerAllQuiz');

if (VerAllQuiz_button) {
    VerAllQuiz_button.addEventListener('click', (e)=>{
        e.preventDefault();
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/VerAllQuiz')
                .then(response => {
                    displayQuiz(response.data);
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

function PrintStatusCad(res) {
    printStatus.innerHTML = ""

    const div = document.createElement("div");
    if (res === '1') {
        div.innerHTML = `
        <h3> Treinamento Cadastrado com sucesso! </h3>
    `;
    }
    else {
        div.innerHTML = `
        <h3> Erro no cadastro do Treinamento </h3>
    `;
    }
    printStatus.appendChild(div);
}

if(submit_button_treino){
    submit_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if (verificar()) {
                const cadastro = {
                    //codigo: Math.floor(Math.random() * 10000),
                    nome_comercial: nome_comercial.value.toUpperCase(),
                    descricao: descricao.value.toUpperCase(),
                    carga_horaria: carga_horaria.value,
                    inicio_inscricoes: inicio_inscricoes.value,
                    fim_inscricoes: fim_inscricoes.value,
                    inicio_treinamento: inicio_treinamento.value,
                    fim_treinamento: fim_treinamento.value,
                    min_inscritos: min_inscritos.value,
                    max_inscritos: max_inscritos.value,
                    Aptidao: QuizAptidao.value.toUpperCase(),
                    case1: Case1.value.toUpperCase(),
                    case2: Case2.value.toUpperCase(),
                    curso1: Curso1_text.value.toUpperCase(),
                    curso2: Curso2_text.value.toUpperCase(),
                }
                //ipcRenderer.invoke("treino-bd", cadastro);
                axios.post('http://localhost:3000/treinamento_create', cadastro)
                .then((res) => {
                    PrintStatusCad(res.data.valor)
                    //console.log(res);
                })
            }
        }
        catch{console.log(e);}
    })
}

const VoltarCRUDAdm_button = document.getElementById("VoltarCrudAdm");

if(VoltarCRUDAdm_button) { 
    VoltarCRUDAdm_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud_treinamento');
        }
        catch{
            console.log(e);
        }
    })
}