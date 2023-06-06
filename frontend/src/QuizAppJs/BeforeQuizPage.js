const axios = require('axios');
const { ipcRenderer } = require('electron');

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

const ViewCadTreinamentosAlunos_button = document.getElementById('ViewCadTreinamentosAlunos');

if (ViewCadTreinamentosAlunos_button) {
    ViewCadTreinamentosAlunos_button.addEventListener('click', (e)=> {
        e.preventDefault();
        try {
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const Usuario = {
                        nomeuser: response.data,
                    }
                    axios.post('http://localhost:3000/ViewTreinamentos_alunosCadastrados', Usuario);
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const NomeTreinamentoForQuiz = document.querySelector('#NomeTreinamentoForQuiz');
const CodTreinamentoForQuiz = document.querySelector('#CodTreinamentoForQuiz');
const IrParaQuiz_button = document.getElementById('IrParaQuiz');

if (IrParaQuiz_button) {
    IrParaQuiz_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                let SpecificTreino = {
                    Nome: NomeTreinamentoForQuiz.value.toUpperCase(),
                    Cod: CodTreinamentoForQuiz.value,
                }
                localStorage.setItem('SpecificTreinamento', JSON.stringify(SpecificTreino));
                ipcRenderer.send('Janela_QuizApp');
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

const IrParaCase1_button = document.getElementById('Case1');
const curso1_treino = document.querySelector(".curso1_treino")
const VerCurso1_button = document.getElementById('VerCurso1');

function display_curso1() {
    curso1_treino.innerHTML = "";
    const infos1 = JSON.parse(localStorage.getItem('SpecificTreinamento'));
    const treinos_1 = { Name: infos1.Nome, Code: infos1.Cod };
    axios.post('http://localhost:3000/Curso1texto', treinos_1)
    .then(response => {
        const text = response.data;
        //console.log(text);
        const div = document.createElement("div");
        div.innerHTML = `<h2>CURSO INTRODUTÓRIO 1</h2><br><br>
        <h3><p>${text[0].Curso1}</p></h3>
        `;
        
        curso1_treino.appendChild(div);
    })
}

if (VerCurso1_button) {
    VerCurso1_button.addEventListener('click', display_curso1);
}

if (IrParaCase1_button) {
    IrParaCase1_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {;
                ipcRenderer.send('Janela_QuizCase1APP');
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

const IrParaCase2_button = document.getElementById('Case2');
const curso2_treino = document.querySelector(".curso2_treino")
const VerCurso2_button = document.getElementById('VerCurso2');

function display_curso2() {
    curso2_treino.innerHTML = "";
    const infos2 = JSON.parse(localStorage.getItem('SpecificTreinamento'));
    const treinos_2 = { Name: infos2.Nome, Code: infos2.Cod };
    axios.post('http://localhost:3000/Curso2texto', treinos_2)
    .then(response => {
        const text = response.data;
        //console.log(text);
        const div = document.createElement("div");
        div.innerHTML = `<h2>CURSO AVANÇADO E MENTORIA</h2><br><br>
        <h3><p>${text[0].Curso2}</p></h3>
        `;
        
        curso2_treino.appendChild(div);
    })
}

if (VerCurso2_button) {
    VerCurso2_button.addEventListener('click', display_curso2);
}

if (IrParaCase2_button) {
    IrParaCase2_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {;
                ipcRenderer.send('Janela_QuizCase2APP');
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

