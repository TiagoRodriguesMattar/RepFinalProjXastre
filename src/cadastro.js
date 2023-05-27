const bcrypt = require("bcrypt");
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { ipcRenderer } = require('electron');

const button_signup = document.getElementById("data");
const email = document.getElementById('user');
const password = document.getElementById('password');
const nome = document.getElementById('nome');

if(button_signup) { 
    button_signup.addEventListener('submit', (e) => {
        var select = document.getElementById('cargo');
	    var option = select.options[select.selectedIndex];
        //console.log("entrou puta")
        console.log(option.value);
        e.preventDefault();
        try{
            const obj = {
                email: email.value,
                password: password.value,
                cargo: option.value.toUpperCase(),
                nome: nome.value.toUpperCase()
            }
            //obj.password = Encrypt(obj.password);
            //ipcRenderer.invoke('cadastro', obj);
            axios.post('http://localhost:3000/signup', obj).
            then((res) => {
                console.log(res.status);
            });
        }
        catch{
            console.log(e);
        }
    })
}

