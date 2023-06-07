const { ipcRenderer } = require('electron');
const axios = require('axios');

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

// PARTE DO ALUNO DE ACESSO AO SEU PERFIL

const show_hist = document.getElementById('show_hist');

if (show_hist) {
    show_hist.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const UserInfos = { email: user.email, password: user.password };
                axios.post('http://localhost:3000/viewjobs', UserInfos)
                .then(response => {
                    axios.post('http://localhost:3000/Show_Hist_Aluno', { nomeAluno: response.data })
                })
            }
            else {
                console.log('acesso negado');
            }
        }
        catch(e){
            console.log(e);
        }
    })
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

const show_vagas_button = document.getElementById('show_vagas');

if (show_vagas_button) {
    show_vagas_button.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const UserInfos = { email: user.email, password: user.password };
                axios.post('http://localhost:3000/viewjobs', UserInfos)
                .then(response => {
                    axios.post('http://localhost:3000/ShowVagas_alunosInscritos', { nomeAluno: response.data })
                })
            }
            else {
                console.log('acesso negado');
            }
        }
        catch(e){
            console.log(e);
        }
    })
}

// PARTE EMPRESA DE ACESSO AO PERFIL DO ALUNO

const ViewAtividadesConcluidasAlunos_button = document.getElementById('VerAtividadesAlunos');

if (ViewAtividadesConcluidasAlunos_button) {
    ViewAtividadesConcluidasAlunos_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/Show_Hist_All_Alunos')
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const ViewNotasAlunos_button = document.getElementById('VerNotasAlunos');

if (ViewNotasAlunos_button) {
    ViewNotasAlunos_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const obj = { email: user.email, password: user.password }
            axios.post('http://localhost:3000/viewjobs', obj)
            .then((response) => {
                const Usuario = {
                    nomeuser: response.data,
                }
                axios.post('http://localhost:3000/ViewNotasAlunos', Usuario);
            })
        }
        catch (e) {
            console.log(e);
        }
    })
}