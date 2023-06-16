const axios = require('axios');
const {ipcRenderer} = require('electron');

const ViewJobs_button = document.getElementById("ViewJobs");
const ViewStudents_button = document.getElementById("ViewStudents");

function updateOption(select){
    const user = JSON.parse(localStorage.getItem('user'));
    const obj = { email: user.email, password: user.password }
    //console.log(obj);
    axios.post('http://localhost:3000/viewjobs', obj)
        .then((response) => {
            localStorage.setItem('Username', JSON.stringify(response.data));
            axios.post('http://localhost:3000/readjob', response)
                .then((response) => {
                    const obj = response.data;
                    for (let i = 0; i < select.length; i++) {
                        select.options.remove(0)
                    }
                    for (let i = 0; i < obj.length; i++) {
                        var c = document.createElement("option");
                        c.value = `${obj[i].JobTitle}`;
                        c.text = obj[i].JobTitle;
                        select.options.add(c, i);
                    }
                })
        })
}

const JobForList = document.querySelector('#JobForList');

updateOption(JobForList);

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

const ListStudentsClass = document.querySelector('.ListStudentsClass');

function displayVagasDeEmprego(obj) {
    ListStudentsClass.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Título da vaga</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].JobTitle}</th>
                </tr>
            <tbody>

            </table>`;
            ListStudentsClass.appendChild(div);
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

const ListStudentsClass2 = document.querySelector('.ViewStudentsClass_2');

function displayStudents(obj) {
    ListStudentsClass2.innerHTML = "";
    const user = JSON.parse(localStorage.getItem('user'));
    const Email = { email: user.email}
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do Aluno</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].alunoname}</th>
                </tr>
            <tbody>

            </table>`;
            ListStudentsClass2.appendChild(div);
        }
}

if (ViewStudents_button) {
    ViewStudents_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            var select = document.getElementById('JobForList');
	        var option = select.options[select.selectedIndex];
            var nome = option.value;
            if(verificar()) {
                const obj = {
                    jobname: nome.toUpperCase(),
                    jobcompany: JSON.parse(localStorage.getItem('Username'))
                }
                axios.post('http://localhost:3000/viewstudents', obj)
                .then((response) => {
                    console.log(response.data)
                    displayStudents(response.data)
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

const VoltarCrudVagas_button = document.getElementById("VoltarCrudVagas");

if(VoltarCrudVagas_button) { 
    VoltarCrudVagas_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud');
        }
        catch{
            console.log(e);
        }
    })
}