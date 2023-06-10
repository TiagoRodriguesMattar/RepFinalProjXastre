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

const button_edit = document.getElementById("button_edit");
if (button_edit) {
    button_edit.addEventListener("click", () => {
        EditFunction();
    })
}

function EditFunction() { 
    var x = document.getElementById("update"); 
    if (x.style.display === "none") { 
        x.style.display = "block"; 
    } else { 
        x.style.display = "none"; 
    } 
} 

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

const ViewJobsClass = document.querySelector('.ViewJobsClass');

function displayVagasDeEmprego(obj) {
    ViewJobsClass.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome da vaga</b></th>
                    <th><b>Atividades</b></th>
                    <th><b>Requisitos</b></th>
                    <th><b>Salário</b></th>
                    <th><b>Número máximo</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].JobTitle}</th>
                    <th>${obj[i].Activities}</th>
                    <th>${obj[i].Requiriments}</th>
                    <th>${obj[i].Salary}</th>
                    <th>${obj[i].MaxNumber}</th>
                </tr>
            <tbody>

            </table>`;
            ViewJobsClass.appendChild(div);
        }
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
                    .then((response) => {
                        displayVagasDeEmprego(response.data);
                    })
                })
            }
        }
        catch(e) {
            console.log(e);
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