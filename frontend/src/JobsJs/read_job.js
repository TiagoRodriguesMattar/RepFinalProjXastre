const axios = require('axios');
const {ipcRenderer} = require('electron');

const read_button = document.getElementById('read_button');

function updateOption(select){
    axios.get('http://localhost:3000/get-AllCompanies')
    .then(response => {
        const obj = response.data;
            for(let i=0;i<select.length;i++){
                select.options.remove(0)
            }
            for(let i=0; i<obj.length;i++){
                var c = document.createElement("option");
                c.value = `${obj[i].Company}`;
                c.text = obj[i].Company;
                select.options.add(c,i);
        }
    })
}

const CompanyNameForRead = document.querySelector('#CompanyNameForRead');
updateOption(CompanyNameForRead);

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

const ReadJobClass = document.querySelector('.ReadJobClass');

function displayVagasDeEmprego(obj) {
    ReadJobClass.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> VAGAS DE EMPREGO CRIADAS DA EMPRESA ${obj[i].Company}</h3>
            <table>
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
            ReadJobClass.appendChild(div);
        }
}

if(read_button){
    read_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                var option = CompanyNameForRead.options[CompanyNameForRead.selectedIndex];
                var nome = option.value
                obj = {
                    data: nome.toUpperCase(),
                }
                console.log(obj)
                axios.post('http://localhost:3000/readjob', obj)
                .then((response)=> {
                    displayVagasDeEmprego(response.data)
                },(error) => {
                  console.log(error);
                })
            }
            else
                console.log('acesso negado');
        }
        catch(e){
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