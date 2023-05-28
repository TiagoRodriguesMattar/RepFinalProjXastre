const bcrypt = require("bcrypt");
const information = document.getElementById('info');

//const { remote } = require('electron');
//const main = remote.require('./main.js');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { ipcRenderer } = require('electron');

const botao_janela_signup = document.getElementById("data");
//const button_login = document.getElementById("login");
const button_signup = document.getElementById("signup");

const email = document.getElementById('user');
const password = document.getElementById('password');

//const cargo = document.getElementById('cargo');
const nome = document.getElementById('nome');

//const email_login = document.getElementById('user_login');
//const password_login = document.getElementById('password_login');

//const { User } = require('./login.js');

//import { User } from './login';

function Encrypt(dados){
    const saltRounds = 10;
    const pass = dados;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass,salt);
    return hash;
}

if(button_signup) { 
    button_signup.addEventListener('submit', (e) => {
        var select = document.getElementById('cargo');
	    var option = select.options[select.selectedIndex];
        console.log("entrou puta")
        console.log(option.value);
        e.preventDefault();
        try{
            const obj = {
                email: email.value,
                password: password.value,
                cargo: option.value.toUpperCase(),
                nome: nome.value.toUpperCase()
            }
            obj.password = Encrypt(obj.password);
            ipcRenderer.invoke('cadastro', obj);
        }
        catch{
            console.log(e);
        }
    })
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

/*if(button_login) {
    button_login.addEventListener('submit', (e) => {
        e.preventDefault();
        try{
            console.log("entrou login")
            const obj = {
                email: email_login.value,
                password: password_login.value
            }
            
            //obj.password = Encrypt(obj.password);
            ipcRenderer.invoke('login', obj);
            ipcRenderer.send('Janela_JobsAllOptions');
        }
        catch{
            console.log(e);
        }
    })
}*/

// index2.html

/*const User = {
    email: '',
    password: '',
    token: '',
}*/



//HTML pages
//Botão de registro de uma nova vaga de emprego (NewJob)
const register_button = document.getElementById("register_button");

const JobTitle = document.querySelector('#JobTitle');
const Company = document.querySelector('#Company');
const Activities = document.querySelector('#Activities');
const Requiriments = document.querySelector('#Requiriments');
const Salary = document.querySelector('#Salary');
const MaxNumber = document.querySelector('#MaxNumber');

if(register_button){
    register_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                const obj = {
                    JobTitle: JobTitle.value,
                    JobCompany: Company.value,
                    JobActivities: Activities.value,
                    JobRequiriments: Requiriments.value,
                    JobSalary: Salary.value,
                    JobMaxNumber: MaxNumber.value
                }
                ipcRenderer.invoke('NewJobChannel', obj);
            }
            else
                console.log('acesso negado');
        }
        catch{
            console.log(e);
        }
    })
}

//Botão de edição de uma vaga de emprego já existente (EditJob)

const edit_button = document.getElementById("edit_button");

const OldJobTitleName = document.querySelector('#OldJobTitle');
const newJobTitle = document.querySelector('#newJobTitle');
const newCompany = document.querySelector('#newCompany');
const newActivities = document.querySelector('#newActivities');
const newRequiriments = document.querySelector('#newRequiriments');
const newSalary = document.querySelector('#newSalary');
const newMaxNumber = document.querySelector('#newMaxNumber');

const ViewJobs_button = document.getElementById('viewJobs');
if(ViewJobs_button) {
    ViewJobs_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                axios.post('http://localhost:3000/signin', {
                    email: email_login.value,
                    senha: password_login.value
                }).then(response => {

                })
            }
        }
        catch(e) {

        }
    })
}

if(edit_button){
    edit_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                const obj = {
                    newJobTitle: newJobTitle.value,
                    newJobCompany: newCompany.value,
                    newJobActivities: newActivities.value,
                    newJobRequiriments: newRequiriments.value,
                    newJobSalary: newSalary.value,
                    newJobMaxNumber: newMaxNumber.value,
                    oldJobTitle: OldJobTitleName.value,
                    oldJobCompany: CompanyNameForRead.value
                }
                ipcRenderer.invoke('EditJobChannel', obj);
            }
            else
                console.log('acesso negado');
        }
        catch{
            console.log(e);
        }
    })
}

const viewjobs = document.getElementById('ViewJobs');
if(viewjobs) {
    viewjobs.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            ipcRenderer.invoke()
        } 
        catch (e) {
            console.log(e);
        }
    })
}

//Botão de leitura de vagas de emprego já existentes de uma determinada empresa (ReadJob)
const read_button = document.getElementById('read_button');

const CompanyNameForRead = document.querySelector('#CompanyNameForRead');

if(read_button){
    read_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                obj = {
                    Name: CompanyNameForRead.value
                }
                ipcRenderer.invoke('ReadJobChannel', obj);
            }
            else
                console.log('acesso negado');
        }
        catch(e){
            console.log(e);
        }
    })
}

//Botão de deleção de vagas de emprego já existentes de uma determinada empresa (DeleteJob)

const delete_button = document.getElementById('delete_button');
const deleteJobTitle = document.querySelector('#DeleteJobTitle');
if(delete_button) {
    delete_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                obj = {
                    JobName: deleteJobTitle.value,
                    JobCompany: CompanyNameForRead.value
                }
                ipcRenderer.invoke('DeleteJobChannel', obj);
            }
            else
                console.log('acesso negado');
        } 
        catch (e) {
            console.log(e);
        }
    })
}