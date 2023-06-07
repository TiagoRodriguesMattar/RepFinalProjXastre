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

const button_ViewHistAlunos = document.getElementById("HistAlunos");

if(button_ViewHistAlunos){
    if(verificar()){
        try{
            button_ViewHistAlunos.addEventListener("click", (e) => {
                ipcRenderer.send('display_hist_alunos');
        });
        }
        catch(e){
            console.log(e);
        }
        
    }
}

const button_ViewVagas = document.getElementById("ViewVagasAdm");

if(button_ViewVagas){
    if(verificar()){
        try{
            button_ViewVagas.addEventListener("click", (e) => {
                ipcRenderer.send('display_vagas_adm');
        });
        }
        catch(e){
            console.log(e);
        }
        
    }
}

const button_crud = document.getElementById("CRUDtreinamentos");

if(button_crud){
    if(verificar()){
        try{
            button_crud.addEventListener("click", (e) => {
                ipcRenderer.send('display_crud_treinamento');
        });
        }
        catch(e){
            console.log(e);
        }
        
    }
}

const button_CRUD_quiz = document.getElementById("CRUDquiz");

if (button_CRUD_quiz) {
    button_CRUD_quiz.addEventListener('click', (e) => {
        try {
            if (verificar()) {
                ipcRenderer.send('display_crud_quiz');
            }
        }
        catch(e){
            console.log(e);
        }
    })
}