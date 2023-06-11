const axios = require('axios');
const e = require('express');

const new_nome_comercial = document.querySelector('#new_nome_comercial');
const new_descricao = document.querySelector('#new_descricao');
const new_carga_horaria = document.querySelector('#new_carga_horaria');
const new_inicio_inscricoes = document.querySelector('#new_inicio_inscricoes');
const new_fim_inscricoes = document.querySelector('#new_fim_inscricoes');
const new_inicio_treinamento = document.querySelector('#new_inicio_inscricoes');
const new_fim_treinamento = document.querySelector('#new_fim_inscricoes');
const new_min_inscritos = document.querySelector('#new_min_inscritos');
const new_max_inscritos = document.querySelector('#new_max_inscritos');
const new_QuizAptidao = document.querySelector('#QuizAptidao');
const new_Case1 = document.querySelector('#Case1');
const new_Case2 = document.querySelector('#Case2');
const new_Curso1_text = document.querySelector('#Curso1text');
const new_Curso2_text = document.querySelector('#Curso2text');

const button_edit_treino = document.getElementById("button_edit_treinamento");
if (button_edit_treino) {
    button_edit_treino.addEventListener("click", () => {
        EditFunction();
    })
}

function EditFunction() { 
    var x = document.getElementById("update"); 
    if (x.style.display === "none") { 
        x.style.display = "block"; 
    } else { 
        x.style.display = "none"; 
    } 
}

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

const ViewTreinamentosAdm = document.querySelector(".ViewTreinamentosAdm");

function displayTreinamentos(obj) {
    ViewTreinamentosAdm.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table class="page-break">
            <thead>
                <tr>
                    <th><b>Nome do treino</b></th>
                    <th><b>Descrição</b></th>
                    <th><b>Carga Horária</b></th>
                    <th><b>Início das inscrições</b></th>
                    <th><b>Fim das inscrições</b></th>
                    <th><b>Início dos treinamentos</b></th>
                    <th><b>Fim dos treinamentos</b></th>
                    <th><b>Mínimo de inscritos</b></th>
                    <th><b>Máximo de inscritos</b></th>
                    <th><b>Nome Quiz de Aptidao</b></th>
                    <th><b>Nome Case 1</b></th>
                    <th><b>Nome Case 2</b></th>
                    <th><b>Texto Curso 1</b></th>
                    <th><b>Texto Curso 2</b></th>
                </tr>
            </thead>
    
            <tbody>
                <tr>
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].descricao}</th>
                    <th>${obj[i].carga_horaria}</th>
                    <th>${obj[i].inicio_inscricoes}</th>
                    <th>${obj[i].fim_inscricoes}</th>
                    <th>${obj[i].inicio_treinamento}</th>
                    <th>${obj[i].fim_treinamento}</th>
                    <th>${obj[i].min_inscritos}</th>
                    <th>${obj[i].max_inscritos}</th>
                    <th>${obj[i].QAptidao}</th>
                    <th>${obj[i].QCase1}</th>
                    <th>${obj[i].QCase2}</th>
                    <th>${obj[i].Curso1}</th>
                    <th>${obj[i].Curso2}</th>
                </tr>

            <tbody>
    
            </table>`;
            ViewTreinamentosAdm.appendChild(div);
        }
}


const ViewTreinamentos_button = document.getElementById('Viewtreinamentos');

if (ViewTreinamentos_button) {
    ViewTreinamentos_button.addEventListener('click', (e) => {
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/ViewAllTreinamentos')
                .then(response => {
                    displayTreinamentos(response.data)
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

const OldTreinamentoTitle = document.querySelector('#OldTreinamentoTitle');
const edit_button_treino = document.getElementById('edit_button_treino');
const OldTreinamentoCodigo = document.querySelector('#OldTreinamentoCodigo');

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
                .then((response) => {
                    displayQuiz(response.data)
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

if (edit_button_treino) {
    edit_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                const obj = {
                    codigo: OldTreinamentoCodigo.value,
                    oldnome_comercial: OldTreinamentoTitle.value.toUpperCase(),
                    newnome_comercial: new_nome_comercial.value.toUpperCase(),
                    newdescricao: new_descricao.value.toUpperCase(),
                    newcarga_horaria: new_carga_horaria.value,
                    newinicio_inscricoes: new_inicio_inscricoes.value,
                    newfim_inscricoes: new_fim_inscricoes.value,
                    newinicio_treinamento: new_inicio_treinamento.value,
                    newfim_treinamento: new_fim_treinamento.value,
                    newmin_inscritos: new_min_inscritos.value,
                    newmax_inscritos: new_max_inscritos.value,
                    newQuizAptidao: new_QuizAptidao.value.toUpperCase(),
                    newQuizCase1: new_Case1.value.toUpperCase(),
                    newQuizCase2: new_Case2.value.toUpperCase(),
                    newCurso1: new_Curso1_text.value.toUpperCase(),
                    newCurso2: new_Curso2_text.value.toUpperCase(),
                }
                axios.post('http://localhost:3000/treinamento_update', obj)
                .then((response)=> {
                }, (error) => {
                    console.log(error);
                })
            }
        }
        catch(e) {
            console.log(e);
        }})
}