const axios = require('axios');
const {ipcRenderer} = require('electron');

const printStatus = document.querySelector('.printStatus');

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

const ViewTreinamentosDelete = document.querySelector(".ViewTreinamentosDelete");

function displayTreinamentosRead(obj) {
    ViewTreinamentosDelete.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do treino</b></th>
                    <th><b>Código</b></th>
                </tr>
            </thead>
    
            <tbody>
                <tr>
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].codigo}</th>
                </tr>

            <tbody>
    
            </table>`;
            ViewTreinamentosDelete.appendChild(div);
        }
}

const ViewTreinamentos_button = document.getElementById('ViewTreinamentos');

if (ViewTreinamentos_button) {
    ViewTreinamentos_button.addEventListener('click', () => {
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/ViewAllTreinamentos')
                .then(response => {
                    displayTreinamentosRead(response.data)
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

function updateOption(select){
    axios.get('http://localhost:3000/ViewAllTreinamentos')
    .then(response => {
        const obj = response.data;
            for(let i=0;i<select.length;i++){
                select.options.remove(0)
            }
            for(let i=0; i<obj.length;i++){
                var c = document.createElement("option");
                c.value = `${obj[i].nome_comercial}_${obj[i].codigo}`;
                c.text = obj[i].nome_comercial;
                select.options.add(c,i);
        }
    })
}

function PrintStatusCad(res) {
    printStatus.innerHTML = ""

    const div = document.createElement("div");
    if (res === '1') {
        div.innerHTML = `
        <h3> Treinamento deletado com sucesso! </h3>
    `;
    }
    else {
        div.innerHTML = `
        <h3> Erro na deleção do Treinamento </h3>
    `;
    }
    printStatus.appendChild(div);
}

const TreinamentoTitleDelete = document.querySelector('#TreinamentoTitle');
updateOption(TreinamentoTitleDelete);

const delete_button_treinamento = document.getElementById('delete_button_treinamento');

if (delete_button_treinamento) {
    delete_button_treinamento.addEventListener('click', () => {
        try {
            var option = TreinamentoTitleDelete.options[TreinamentoTitleDelete.selectedIndex];
            var nome = option.value.split('_')[0]
            var cod = option.value.split('_')[1]
            obj = {
                Nome: nome.toUpperCase(),
                Cod: cod,
            }
            axios.post('http://localhost:3000/DeleteTreinamento', obj)
            .then(response => {
                PrintStatusCad(response.data.valor)
            })
        }
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarCRUDAdm_button = document.getElementById("VoltarCrudAdm");

if(VoltarCRUDAdm_button) { 
    VoltarCRUDAdm_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud_treinamento');
        }
        catch{
            console.log(e);
        }
    })
}