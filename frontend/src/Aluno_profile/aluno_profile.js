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


const status = document.querySelector(".status");


function displayStatus(obj) {
    status.innerHTML = "";
        for(let i = 0; i < obj.Aprovados.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
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
                    axios.post('http://localhost:3000/ViewTreinamentos_alunosCadastrados', Usuario)
                    .then((res) => {
                        console.log(res.data)
                    })
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}
