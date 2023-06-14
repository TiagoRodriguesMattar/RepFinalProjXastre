const { ipcRenderer, } = require('electron');
const axios = require('axios');

const email_login = document.getElementById('user_login');
const password_login = document.getElementById('password_login');
const button_login = document.getElementById("login");
const botao_janela_signup = document.getElementById("data");

let User = {
    email: '',
    password: '',
    token: '',
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function login(e) {
    e.preventDefault();
    try {
        User.email = email_login.value,
        User.password = password_login.value
        axios.post('http://localhost:3000/login', User)
            .then((res) => {
                console.log(res.status);
                if (res.status === 200) {
                    User.token = res.data.accessToken;
                    axios.post('http://localhost:3000/verifycargo', User)
                    .then((res) => {
                        if(res.data === 'ALUNO'){    
                            //ipcRenderer.send("OpenAluno")               
                            ipcRenderer.send('Janela_HomeAlunoPerm');
                        }
                        if(res.data === 'EMPRESA'){
                            ipcRenderer.send('Janela_HomeEmpresas');
                        }
                        if(res.data === 'ADM'){
                            ipcRenderer.send('janela_HomeAdmPerm');
                        }
                        if(res.data === 'MENTOR'){
                            ipcRenderer.send('janela_HomeMentor');
                        }
                    })
                }
                saveUser(User)
            }, (error) => {
                console.log(error);
            })
    }
    catch {
        console.log(e);
    }
}

if (button_login) {
    button_login.addEventListener('submit', login)
}

if(botao_janela_signup) {
    botao_janela_signup.addEventListener('submit', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('janela_signup');
        }
        catch{
            console.log(e);
        }
    })
}