const axios = require('axios');
const e = require('express');
const {ipcRenderer} = require('electron');

const new_nome_comercial = document.querySelector('#new_nome_comercial');
const new_descricao = document.querySelector('#new_descricao');
const new_carga_horaria = document.querySelector('#new_carga_horaria');
const new_inicio_inscricoes = document.querySelector('#new_inicio_inscricoes');
const new_fim_inscricoes = document.querySelector('#new_fim_inscricoes');
const new_inicio_treinamento = document.querySelector('#new_inicio_inscricoes');
const new_fim_treinamento = document.querySelector('#new_fim_inscricoes');
const new_min_inscritos = document.querySelector('#new_min_inscritos');
const new_max_inscritos = document.querySelector('#new_max_inscritos');
const new_Curso1_text = document.querySelector('#Curso1text');
const new_Curso2_text = document.querySelector('#Curso2text');

const printStatus = document.querySelector('.printStatus');

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
                    <th><b>Código</b></th>
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
                    <th>${obj[i].codigo}</th>
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

function updateQuiz(select){
    axios.get('http://localhost:3000/VerAllQuiz')
    .then((response) => {
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

const new_QuizAptidao = document.querySelector('#QuizAptidao');
updateQuiz(new_QuizAptidao);
const new_Case1 = document.querySelector('#Case1');
updateQuiz(new_Case1);
const new_Case2 = document.querySelector('#Case2');
updateQuiz(new_Case2);

function updateOption(select){
    axios.get('http://localhost:3000/ViewAllTreinamentos')
    .then(response => {
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


const OldTreinamentoTitle = document.getElementById('OldTreinamentoTitle');
updateOption(OldTreinamentoTitle);

function PrintStatusCad(res) {
    printStatus.innerHTML = ""

    const div = document.createElement("div");
    if (res === '1') {
        div.innerHTML = `
        <h3> Treinamento atualizado com sucesso! </h3>
    `;
    }
    else {
        div.innerHTML = `
        <h3> Erro na atualização do Treinamento </h3>
    `;
    }
    printStatus.appendChild(div);
}

const edit_button_treino = document.getElementById('edit_button_treino');

if (edit_button_treino) {
    edit_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            console.log("oi botao treino")
            if (verificar()) {
                var option = OldTreinamentoTitle.options[OldTreinamentoTitle.selectedIndex];
                var nome = option.value.split('_')[0]
                var cod = option.value.split('_')[1]
                var option1 = new_QuizAptidao.options[new_QuizAptidao.selectedIndex];
                var nome1 = option1.value
                var option2 = new_Case1.options[new_Case1.selectedIndex];
                var nome2 = option2.value
                var option3 = new_Case2.options[new_Case2.selectedIndex];
                var nome3 = option3.value
                const obj = {
                    codigo: cod,
                    oldnome_comercial: nome.toUpperCase(),
                    newnome_comercial: new_nome_comercial.value.toUpperCase(),
                    newdescricao: new_descricao.value.toUpperCase(),
                    newcarga_horaria: new_carga_horaria.value,
                    newinicio_inscricoes: new_inicio_inscricoes.value,
                    newfim_inscricoes: new_fim_inscricoes.value,
                    newinicio_treinamento: new_inicio_treinamento.value,
                    newfim_treinamento: new_fim_treinamento.value,
                    newmin_inscritos: new_min_inscritos.value,
                    newmax_inscritos: new_max_inscritos.value,
                    newQuizAptidao: nome1.toUpperCase(),
                    newQuizCase1: nome2.toUpperCase(),
                    newQuizCase2: nome3.toUpperCase(),
                    newCurso1: new_Curso1_text.value.toUpperCase(),
                    newCurso2: new_Curso2_text.value.toUpperCase(),
                }
                axios.post('http://localhost:3000/treinamento_update', obj)
                .then((response)=> {
                    PrintStatusCad(response.data.valor)
                }, (error) => {
                    console.log(error);
                })
            }
        }
        catch(e) {
            console.log(e);
        }})
}

const VoltarCRUDAdm_edit_button = document.getElementById("VoltarCrudAdm_edit");

if(VoltarCRUDAdm_edit_button) { 
    VoltarCRUDAdm_edit_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud_treinamento');
        }
        catch{
            console.log(e);
        }
    })
}