const axios = require('axios');
const e = require('express');

function verificar() {
    var auth = true;

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

const treinamentos = document.querySelector(".treinamentos");

function displayTreinamentos() {
    treinamentos.innerHTML = "";
    axios.get('http://localhost:3000/ViewTreinamentosAgora')
    .then(response => {
        const obj = response.data;
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
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
                    <th><b>Quiz de aptidão</b></th>
                    <th><b>Case 1</b></th>
                    <th><b>Case 2</b></th>
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
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].fim_treinamento}</th>
                    <th>${obj[i].min_inscritos}</th>
                    <th>${obj[i].max_inscritos}</th>
                    <th>${obj[i].QAptidao}</th>
                    <th>${obj[i].QCase1}</th>
                    <th>${obj[i].QCase2}</th>
                </tr>
            <tbody>
    
            </table>`;
            treinamentos.appendChild(div);
        }
    })
}

const ViewTreinamentosAgora_button = document.getElementById('ViewTreinamentosAgora');

if (ViewTreinamentosAgora_button) {
    ViewTreinamentosAgora_button.addEventListener('click', (e)=> {
        e.preventDefault();
        try {
            if(verificar()) {
                displayTreinamentos()
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const NomeTreinamentoCad = document.querySelector('#NomeTreinamentoCad');
const CodTreinamentoCad = document.querySelector('#CodTreinamentoCad');
const CadUserTreino_button = document.getElementById('CadUserTreino');

if (CadUserTreino_button) {
    CadUserTreino_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const treinodata = {
                        nomeuser: response.data,
                        treinoname: NomeTreinamentoCad.value.toUpperCase(),
                        treinocodigo: CodTreinamentoCad.value.toUpperCase()
                    }
                    axios.post('http://localhost:3000/CadUsuarioTreino', treinodata);
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}
