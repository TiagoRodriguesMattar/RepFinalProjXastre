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

const button_edit_treino = document.getElementById("button_edit_treino");
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

const ViewTreinamentos_button = document.getElementById('Viewtreinamentos');

if (ViewTreinamentos_button) {
    ViewTreinamentos_button.addEventListener('click', (e) => {
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/ViewAllTreinamentos');
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

const OldTreinamentoTitle = document.querySelector('#OldTreinamentoTitle');
const edit_button_treino = document.getElementById('edit_button_treino');

if (edit_button_treino) {
    edit_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                const objcod = {
                    Nome: OldTreinamentoTitle.value.toUpperCase()
                }
                axios.post('http://localhost:3000/GetCodigo', objcod)
                .then((response) => {
                    const obj = {
                        oldcodigo: response.data[0].codigo,
                        newnome_comercial: new_nome_comercial.value.toUpperCase(),
                        newdescricao: new_descricao.value.toUpperCase(),
                        newcarga_horaria: new_carga_horaria.value,
                        newinicio_inscricoes: new_inicio_inscricoes.value,
                        newfim_inscricoes: new_fim_inscricoes.value,
                        newinicio_treinamento: new_inicio_treinamento.value,
                        newfim_treinamento: new_fim_treinamento.value,
                        newmin_inscritos: new_min_inscritos.value,
                        newmax_inscritos: new_max_inscritos.value,
                    }
                    axios.post('http://localhost:3000/treinamento_update', obj)
                    .then((response)=> {
                    }, (error) => {
                        console.log(error);
                    })
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}