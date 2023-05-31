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

const NewTreino_button = document.getElementById("CreateTreinamento");

if(NewTreino_button){
    NewTreino_button.addEventListener('click', () => {
        try {
            if(verificar())
                ipcRenderer.send("janela_NewTreinoWindow");
            else
                console.log('acesso negado');
        }
        catch(e) {
            console.log(e);
        }
    })
}

const EditTreino_button = document.getElementById("UpdateTreinamento");

if(EditTreino_button){
    EditTreino_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("janela_EditTreinoWindow");
            else
                console.log('acesso negado');
        }catch(e){
            console.log(e);
        }
    })
}

const ReadTreino_button = document.getElementById("ReadTreinamento");

if(ReadTreino_button){
    ReadTreino_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("janela_ReadTreinoWindow");
            else
                console.log('acesso negado');
        }catch(e){
            console.log(e);
        }
    })
}

const DeleteTreino_button = document.getElementById("DeleteTreinamento");

if(DeleteTreino_button){
    DeleteTreino_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("Janela_DeleteJob");
            else
                console.log('acesso negado');
        }catch(e){
            console.log(e);
        }
    })
}