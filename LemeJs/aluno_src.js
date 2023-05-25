const { ipcRenderer } = require('electron');

const button_signin = document.getElementById("data");
const button_login = document.getElementById("login");
const email = document.getElementById('user');
const password = document.getElementById('password');

button_signin.addEventListener('submit', (e) => {
    e.preventDefault();
    try{
        console.log("botao");
        const obj = {
            email: email.value,
            password: password.value
        }
        ipcRenderer.invoke('some-name', obj);
    }
    catch{
        console.log(e);
    }
})