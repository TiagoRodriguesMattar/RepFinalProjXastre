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

const status = document.querySelector(".status");

function displayStatus(obj) {
    status.innerHTML = "";
        for(let i = 0; i < obj.Aprovados.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> STATUS DOS TREINAMENTOS </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome da treino</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Aprovados[i].treinoname}</th>
                    <th>${obj.Aprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            status.appendChild(div);
        }
        for(let i = 0; i < obj.Reprovados.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<br><table>
            <thead>
                <tr>
                    <th><b>Nome da treino</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Reprovados[i].treinoname}</th>
                    <th>${obj.Reprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            status.appendChild(div);
        }
}

const TreinamentosInscritos = document.querySelector(".TreinamentosInscritos");

function displayTreinamentosInscritos(obj) {
    TreinamentosInscritos.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> TREINAMENTOS INSCRITOS </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome da treino</b></th>
                    <th><b>Código do treino</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].treinoname}</th>
                    <th>${obj[i].treinocodigo}</th>
                </tr>
            <tbody>

            </table>`;
            TreinamentosInscritos.appendChild(div);
        }
}

const VagasDeEmprego = document.querySelector(".VagasDeEmprego");

function displayVagasDeEmprego(obj) {
    VagasDeEmprego.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> VAGAS DE EMPREGO INSCRITAS </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome da vaga</b></th>
                    <th><b>Nome da empresa</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].jobname}</th>
                    <th>${obj[i].jobcompany}</th>
                </tr>
            <tbody>

            </table>`;
            VagasDeEmprego.appendChild(div);
        }
}

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
                    .then((res) => {
                        console.log(res.data)
                        displayStatus(res.data);
                    })
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
                    axios.post('http://localhost:3000/ViewTreinamentos_status_0_1', Usuario)
                    .then((res) => {
                        displayTreinamentosInscritos(res.data)
                    })
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
                    .then(response => {
                        displayVagasDeEmprego(response.data);
                    })
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

// PARTE EMPRESA DE ACESSO AO PERFIL DO ALUNO

const VerAtividadesAlunosClass = document.querySelector(".VerAtividadesAlunosClass");

function VerAtividadesAlunosClass_f(obj) {
    VerAtividadesAlunosClass.innerHTML = "";
        for(let i = 0; i < obj.Aprovados.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> Atividades concluídas </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Atividade</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Aprovados[i].alunoname}</th>
                    <th>${obj.Aprovados[i].treinoname}</th>
                    <th>${obj.Aprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            VerAtividadesAlunosClass.appendChild(div);
        }

        for(let i = 0; i < obj.Reprovados.length; i++) {
            const div2 = document.createElement("div");
            div2.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Atividade</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Reprovados[i].alunoname}</th>
                    <th>${obj.Reprovados[i].treinoname}</th>
                    <th>${obj.Reprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            VerAtividadesAlunosClass.appendChild(div2);
        }
}

const ViewAtividadesConcluidasAlunos_button = document.getElementById('VerAtividadesAlunos');       // EMPRESA E ADM

if (ViewAtividadesConcluidasAlunos_button) {
    ViewAtividadesConcluidasAlunos_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/Show_Hist_All_Alunos')
                .then((response) => {
                    VerAtividadesAlunosClass_f(response.data)
                    console.log(response.data)
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VerNotasAlunosClass = document.querySelector(".VerNotasAlunosClass");

function displayNotasAlunos(obj) {
    console.log(obj.NomeAluno.length)
    VerNotasAlunosClass.innerHTML = "";
        for(let i = 0; i < obj.NomeAluno.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> Notas dos alunos </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Nome do Quiz</b></th>
                    <th><b>Número de acertos</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.NomeAluno[i]}</th>
                    <th>${obj.NomeQuiz[i]}</th>
                    <th>${obj.NumAcertos[i]}</th>
                </tr>
            <tbody>

            </table>`;
            VerNotasAlunosClass.appendChild(div);
        }
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
                axios.post('http://localhost:3000/ViewNotasAlunos', Usuario)
                .then((response) => {
                    console.log(response.data)
                    displayNotasAlunos(response.data)
                })
            })
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarHomeEmpresa_button = document.getElementById("VoltarHomeEmpresa");

if(VoltarHomeEmpresa_button) { 
    VoltarHomeEmpresa_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('Janela_HomeEmpresas');
        }
        catch{
            console.log(e);
        }
    })
}

// PARTE ADM DE ACESSO AO PERFIL DO ALUNO

const VerNotasAlunosAdmClass = document.querySelector(".VerNotasAlunosAdmClass");

function displayNotasAlunosAdm(obj) {
    VerNotasAlunosAdmClass.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> Notas dos alunos </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Nome do Quiz</b></th>
                    <th><b>Número de acertos</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].NomeAluno}</th>
                    <th>${obj[i].NomeQuiz}</th>
                    <th>${obj[i].NumAcertos}</th>
                </tr>
            <tbody>

            </table>`;
            VerNotasAlunosAdmClass.appendChild(div);
        }
}


const ViewNotasAlunos_button_adm = document.getElementById('VerNotasAlunosAdm');

if (ViewNotasAlunos_button_adm) {
    ViewNotasAlunos_button_adm.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            axios.get('http://localhost:3000/get-NotasAllAlunos')
            .then(response => {
                //console.log(response)
                displayNotasAlunosAdm(response.data)
            })
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarHomeAdm_button = document.getElementById("VoltarHomeAdm");

if(VoltarHomeAdm_button) { 
    VoltarHomeAdm_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('janela_HomeAdmPerm');
        }
        catch{
            console.log(e);
        }
    })
}

// PARTE MENTOR DE ACESSO AO PERFIL DO ALUNO

const Ver10utimasAtividadesALunosClass = document.querySelector(".Ver10utimasAtividadesALunosClass");

function VerAtividadesAlunosClass_f_mentor(obj) {
    Ver10utimasAtividadesALunosClass.innerHTML = "";
        for(let i = 0; i < obj.Aprovados.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> Atividades concluídas </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Atividade</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Aprovados[i].alunoname}</th>
                    <th>${obj.Aprovados[i].treinoname}</th>
                    <th>${obj.Aprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            Ver10utimasAtividadesALunosClass.appendChild(div);
        }

        for(let i = 0; i < obj.Reprovados.length; i++) {
            const div2 = document.createElement("div");
            div2.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do aluno</b></th>
                    <th><b>Atividade</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj.Reprovados[i].alunoname}</th>
                    <th>${obj.Reprovados[i].treinoname}</th>
                    <th>${obj.Reprovados[i].status}</th>
                </tr>
            <tbody>

            </table>`;
            Ver10utimasAtividadesALunosClass.appendChild(div2);
        }
}

const Ver10utimasAtividadesALunos_b = document.getElementById('Ver10utimasAtividadesALunos');

if (Ver10utimasAtividadesALunos_b) {
    Ver10utimasAtividadesALunos_b.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            axios.get('http://localhost:3000/get-atividades-mentor')
            .then((response) => {
                VerAtividadesAlunosClass_f_mentor(response.data)
            })
        }
        catch (e) {
            console.log(e);
        }
    })
}
