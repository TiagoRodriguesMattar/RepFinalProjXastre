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

const TreinamentoTitleDelete = document.querySelector('#TreinamentoTitle');
const CodigoTreinoDelete = document.querySelector('#CodigoTreino');
const delete_button_treinamento = document.getElementById('delete_button_treinamento');

if (delete_button_treinamento) {
    delete_button_treinamento.addEventListener('click', () => {
        try {
            obj = {
                Nome: TreinamentoTitleDelete.value.toUpperCase(),
                Cod: CodigoTreinoDelete.value,
            }
            axios.post('http://localhost:3000/DeleteTreinamento', obj);
        }
        catch (e) {
            console.log(e);
        }
    })
}
