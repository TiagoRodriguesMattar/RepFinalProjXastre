const bcrypt = require("bcrypt");

const { ipcRenderer } = require('electron');


const button = document.getElementById("data");
const button_login = document.getElementById("Login");
const email = document.getElementById('user');
const password = document.getElementById('password');
const cargo = document.getElementById('cargo');
const nome = document.getElementById('nome');
const email_login = document.getElementById('user_login');
const password_login = document.getElementById('password_login');
 

function Encrypt(dados){
    
    const saltRounds = 10;
    const pass = dados;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass,salt);
    return hash;
}



button.addEventListener('submit', (e) => {
    e.preventDefault();
    try{
        const obj = {
            email: email.value,
            password: password.value,
            cargo: cargo.value.toUpperCase(),
            nome: nome.value.toUpperCase()
        }
        obj.password = Encrypt(obj.password);
        ipcRenderer.invoke('some-name', obj);
    }
    catch{
        console.log(e);
    }
})

button_login.addEventListener('submit', (e) => {
    console.log("botao login funfando");
    e.preventDefault();
    try{
        const obj = {
            email: email_login.value,
            password: password_login.value
        }
        //obj.password = Encrypt(obj.password);
        ipcRenderer.invoke('login', obj);
    }
    catch{
        console.log(e);
    }
})

const button_aluno = document.getElementById("aluno");

button_aluno.addEventListener('submit', (e) => {
    try{
        ipcRenderer.send('janela_aluno');
    }catch(e){
        console.log(e);
    }
})

const button_adm = document.getElementById("adm");

button_adm.addEventListener('submit', (e) => {
    try{
        ipcRenderer.send('janela_adm');
    }catch(e){
        console.log(e);
    }
})

const button_mod = document.getElementById("mod");

button_mod.addEventListener('submit', (e) => {
    try{
        ipcRenderer.send('janela_mod');
    }catch(e){
        console.log(e);
    }
})

const button_empresa = document.getElementById("empresa");

button_empresa.addEventListener('submit', (e) => {
    try{
        ipcRenderer.send('janela_empresa');
    }catch(e){
        console.log(e);
    }
})
    

    

    
 