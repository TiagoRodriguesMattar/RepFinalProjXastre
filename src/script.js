const { ipcRenderer } = require('electron');
const axios = require('axios');
const jwt = require('jsonwebtoken');

//index.HTML
const NewJob_button = document.getElementById("NewJob");

function verificar() {
    var auth = true;
    let token;
    axios.post('https://api-dados.herokuapp.com/login',{email: 'b@gmail.com', password: '12345'})
    .then((res) => {
        token = res.data.accessToken;
        axios.post('http://localhost:3000/auth', {}, {
            headers: {'authorization': `Basic ${token}`}
        })
        .then((res)=>{
            if(res.status === 401) 
                auth = false;
        })
    })
    return auth;
}

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