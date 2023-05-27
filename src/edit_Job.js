const axios = require('axios');
const { ipcRenderer } = require('electron');

const edit_button = document.getElementById("edit_button");
const ViewJobs_button = document.getElementById("ViewJobs");

const OldJobTitleName = document.querySelector('#OldJobTitle');
const newJobTitle = document.querySelector('#newJobTitle');
const newActivities = document.querySelector('#newActivities');
const newRequiriments = document.querySelector('#newRequiriments');
const newSalary = document.querySelector('#newSalary');
const newMaxNumber = document.querySelector('#newMaxNumber');

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
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                //console.log(obj);
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    localStorage.setItem('Username', JSON.stringify(response.data));
                    axios.post('http://localhost:3000/readjob', response)
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
                    newJobTitle: newJobTitle.value.toUpperCase(),
                    newJobActivities: newActivities.value.toUpperCase(),
                    newJobRequiriments: newRequiriments.value.toUpperCase(),
                    newJobSalary: newSalary.value,
                    newJobMaxNumber: newMaxNumber.value,
                    oldJobTitle: OldJobTitleName.value.toUpperCase(),
                    oldJobCompany: JSON.parse(localStorage.getItem('Username'))
                }
                axios.post('http://localhost:3000/editjob', obj)
                .then((response)=> {
                }, (error) => {
                    console.log(error);
                })
            }
            else
                console.log('acesso negado');
        }
        catch{
            console.log(e);
        }
    })
}