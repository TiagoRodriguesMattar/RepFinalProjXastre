const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const button_submit = document.getElementById("submit_select");



if(button_submit){
    button_submit.addEventListener('click', () => {
        var select = document.getElementById("treinos");
        var opcaoTexto = select.options[select.selectedIndex].text;

        console.log(opcaoTexto);
    })
}