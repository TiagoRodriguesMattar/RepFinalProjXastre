const axios = require('axios');
const { ipcRenderer } = require('electron');

const ViewJobs_button = document.getElementById("ViewJobs");
const delete_button = document.getElementById('delete_button');
const deleteJobTitle = document.querySelector('#OldJobTitle');

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

const DeleteJobsClass = document.querySelector('.DeleteJobsClass');

function displayVagasDeEmprego(obj) {
    DeleteJobsClass.innerHTML = "";
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
            DeleteJobsClass.appendChild(div);
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
                    .then(res => {
                        displayVagasDeEmprego(res.data)
                    })
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

if(delete_button) {
    delete_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                const obj = {
                    JobName: deleteJobTitle.value,
                    JobCompany: JSON.parse(localStorage.getItem('Username'))
                }
                axios.post('http://localhost:3000/deletejob', obj)                
                .then((response)=> {
                }, (error) => {
                    console.log(error);
                })
            }
            else
                console.log('acesso negado');
        } 
        catch (e) {
            console.log(e);
        }
    })
}