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

const ShowVagas = document.getElementById('show_vagas');

if (ShowVagas) {
    ShowVagas.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                ipcRenderer.send("Janela_AlunoJobs");
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

const ShowTreinamentos = document.getElementById('show_treinamentos');

if (ShowTreinamentos) {
    ShowTreinamentos.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                ipcRenderer.send("Janela_AlunoTreinamentos");
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

const ShowTestes = document.getElementById('show_testes');

if (ShowTestes) {
    ShowTestes.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                ipcRenderer.send("Janela_alunoTestes");
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

const Show_profile = document.getElementById('show_profile');

if (Show_profile) {
    Show_profile.addEventListener('click', (e) => {
        try{
            if (verificar()) {
                ipcRenderer.send("Janela_alunoProfile");
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

