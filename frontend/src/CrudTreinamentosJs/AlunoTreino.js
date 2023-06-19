const axios = require('axios');
const e = require('express');
const {ipcRenderer} = require('electron');

const printStatus = document.querySelector('.printStatus');

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
            div.innerHTML = `<h2>Treinamento: ${obj[i].nome_comercial}</h2>
            
            <table>
            <thead>
                <tr>
                    <th><b>Nome do treino</b></th>
                    <th><b>Código</b></th>
                    <th><b>Descrição</b></th>
                    <th><b>Carga Horária</b></th>
                </tr>
            </thead>
    
            <tbody>
                <tr>
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].codigo}</th>
                    <th>${obj[i].descricao}</th>
                    <th>${obj[i].carga_horaria}</th>
                </tr>
            <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Início das inscrições</b></th>
                        <th><b>Fim das inscrições</b></th>
                        <th><b>Início dos treinamentos</b></th>
                        <th><b>Fim dos treinamentos</b></th>
                    </tr>
                </thead>
    
            <tbody>
                    <tr>
                        <th>${obj[i].inicio_inscricoes}</th>
                        <th>${obj[i].fim_inscricoes}</th>
                        <th>${obj[i].inicio_treinamento}</th>
                        <th>${obj[i].fim_treinamento}</th>
                    </tr>
            <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Mínimo de inscritos</b></th>
                        <th><b>Máximo de inscritos</b></th>
                        <th><b>Nome Quiz de Aptidao</b></th>
                        <th><b>Nome Case 1</b></th>
                        <th><b>Nome Case 2</b></th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <th>${obj[i].min_inscritos}</th>
                        <th>${obj[i].max_inscritos}</th>
                        <th>${obj[i].QAptidao}</th>
                        <th>${obj[i].QCase1}</th>
                        <th>${obj[i].QCase2}</th>
                    </tr>
                <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Texto Curso 1</b></th>
                        <th><b>Texto Curso 2</b></th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <th>${obj[i].Curso1}</th>
                        <th>${obj[i].Curso2}</th>
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

function updateOption(select){
    axios.get('http://localhost:3000/ViewTreinamentosAgora')
    .then((response) => {
            const obj = response.data;
            for(let i=0;i<select.length;i++){
                select.options.remove(0)
            }
            for(let i=0; i<obj.length;i++){
                var c = document.createElement("option");
                c.value = `${obj[i].nome_comercial}_${obj[i].codigo}`;
                c.text = obj[i].nome_comercial;
                select.options.add(c,i);
        }
    })
}

const NomeTreinamentoCad = document.getElementById('NomeTreinamentoCad');
const CadUserTreino_button = document.getElementById('CadUserTreino');

updateOption(NomeTreinamentoCad);

function PrintStatusCad(res) {
    printStatus.innerHTML = ""

    const div = document.createElement("div");
    if (res === '1') {
        div.innerHTML = `
        <h3>Cadastrado realizado com sucesso! </h3>
    `;
    }
    else {
        div.innerHTML = `
        <h3> Erro na realização do cadastro! </h3>
    `;
    }
    printStatus.appendChild(div);
}

if (CadUserTreino_button) {
    CadUserTreino_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                var select = document.getElementById('NomeTreinamentoCad');
	            var option = select.options[select.selectedIndex];
                var nome = option.value.split("_")[0];
                var cod = option.value.split("_")[1];
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const treinodata = {
                        nomeuser: response.data,
                        treinoname: nome.toUpperCase(),
                        treinocodigo: cod.toUpperCase()
                    }
                    axios.post('http://localhost:3000/CadUsuarioTreino', treinodata)
                    .then(response => {
                        PrintStatusCad(response.data.valor)
                    })
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarHomeAluno_button = document.getElementById("VoltarHomeAluno");

if(VoltarHomeAluno_button) { 
    VoltarHomeAluno_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('Janela_HomeAlunoPerm');
        }
        catch{
            console.log(e);
        }
    })
}