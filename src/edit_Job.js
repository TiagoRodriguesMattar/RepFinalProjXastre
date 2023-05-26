const axios = require('axios');
const { ipcRenderer } = require('electron');

const edit_button = document.getElementById("edit_button");

const OldJobTitleName = document.querySelector('#OldJobTitle');
const newJobTitle = document.querySelector('#newJobTitle');
const newCompany = document.querySelector('#newCompany');
const newActivities = document.querySelector('#newActivities');
const newRequiriments = document.querySelector('#newRequiriments');
const newSalary = document.querySelector('#newSalary');
const newMaxNumber = document.querySelector('#newMaxNumber');

const ViewJobs_button = document.getElementById('viewJobs');

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