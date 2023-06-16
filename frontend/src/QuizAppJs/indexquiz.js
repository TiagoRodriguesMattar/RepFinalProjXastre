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

const button_montar_Quiz = document.getElementById("QuizMontagem");

if (button_montar_Quiz) {
    button_montar_Quiz.addEventListener('click', (e) => {
        try {
            if (verificar()) {
                ipcRenderer.send('display_montar_Quiz');
            }
        }
        catch(e){
            console.log(e);
        }
    })
}

const button_delete_Quiz = document.getElementById("QuizDelete");

if(button_delete_Quiz){
    button_delete_Quiz.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("display_delete_Quiz");
            else
                console.log('acesso negado');
        }catch(e){
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
