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

const NewJob_button = document.getElementById("NewJob");

if(NewJob_button){
    NewJob_button.addEventListener('click', () => {
        try {
            if(verificar())
                ipcRenderer.send("Janela_NewJob");
            else
                console.log('acesso negado');
        }
        catch(e) {
            console.log(e);
        }
    })
}

const EditJob_button = document.getElementById("EditJob");

if(EditJob_button){
    EditJob_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("Janela_EditJob");
            else
                console.log('acesso negado');
        }catch(e){
            console.log(e);
        }
    })
}

const ReadJob_button = document.getElementById("ReadJob");

if(ReadJob_button){
    ReadJob_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("Janela_ReadJob");
            else
                console.log('acesso negado');
        }catch(e){
            console.log(e);
        }
    })
}

const Deletejob_button = document.getElementById("DeleteJob");

if(Deletejob_button){
    Deletejob_button.addEventListener('click', (e) => {
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

const ListStudents_button = document.getElementById("ListStudents");

if (ListStudents_button){
    ListStudents_button.addEventListener('click', (e) => {
        try{
            if(verificar())
                ipcRenderer.send("Janela_ListStudents");
            else
                console.log('acesso negado');
        }catch(e){
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