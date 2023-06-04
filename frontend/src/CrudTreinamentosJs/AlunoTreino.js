const axios = require('axios');
const e = require('express');

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

const ViewTreinamentosAgora_button = document.getElementById('ViewTreinamentosAgora');

if (ViewTreinamentosAgora_button) {
    ViewTreinamentosAgora_button.addEventListener('click', (e)=> {
        e.preventDefault();
        try {
            if(verificar()) {
                axios.get('http://localhost:3000/ViewTreinamentosAgora');
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

const NomeTreinamentoCad = document.querySelector('#NomeTreinamentoCad');
const CodTreinamentoCad = document.querySelector('#CodTreinamentoCad');
const CadUserTreino_button = document.getElementById('CadUserTreino');

if (CadUserTreino_button) {
    CadUserTreino_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const treinodata = {
                        nomeuser: response.data,
                        treinoname: NomeTreinamentoCad.value.toUpperCase(),
                        treinocodigo: CodTreinamentoCad.value.toUpperCase()
                    }
                    axios.post('http://localhost:3000/CadUsuarioTreino', treinodata);
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}
