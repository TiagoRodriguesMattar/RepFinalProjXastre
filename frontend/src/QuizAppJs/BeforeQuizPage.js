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

