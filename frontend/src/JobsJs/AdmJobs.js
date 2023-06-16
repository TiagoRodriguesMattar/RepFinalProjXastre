const { ipcRenderer } = require('electron');
const axios = require('axios');

function verificar() {
    var auth = true;

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

const VerVagasDeEmpregoClass = document.querySelector(".VerVagasDeEmpregoClass");

function displayVagasDeEmprego(obj) {
    VerVagasDeEmpregoClass.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<h3> VAGAS DE EMPREGO INSCRITAS </h3>
            <table>
            <thead>
                <tr>
                    <th><b>Nome da vaga</b></th>
                    <th><b>Nome da empresa</b></th>
                    <th><b>Atividades</b></th>
                    <th><b>Requisitos</b></th>
                    <th><b>Salário</b></th>
                    <th><b>Número máximo</b></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>${obj[i].JobTitle}</th>
                    <th>${obj[i].Company}</th>
                    <th>${obj[i].Activities}</th>
                    <th>${obj[i].Requiriments}</th>
                    <th>${obj[i].Salary}</th>
                    <th>${obj[i].MaxNumber}</th>
                </tr>
            <tbody>

            </table>`;
            VerVagasDeEmpregoClass.appendChild(div);
        }
}


const button_ViewVagas = document.getElementById("VerVagasDeEmprego");

if(button_ViewVagas){
    if(verificar()){
        try{
            button_ViewVagas.addEventListener("click", (e) => {
                e.preventDefault();
                if (verificar()){
                    axios.post('http://localhost:3000/readAlljob')
                    .then(response => {
                        displayVagasDeEmprego(response.data)
                    })
                }
        });
        }
        catch(e){
            console.log(e);
        }
        
    }
}

const VoltarHomeAdm_button = document.getElementById("VoltarHomeAdm");

if(VoltarHomeAdm_button) { 
    VoltarHomeAdm_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('janela_HomeAdmPerm');
        }
        catch{
            console.log(e);
        }
    })
}