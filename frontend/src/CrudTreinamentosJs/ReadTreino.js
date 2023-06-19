const axios = require('axios');
const {ipcRenderer} = require('electron');

const read_button_treino = document.getElementById('read_button_treinamento');

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

const TreinoNameForRead = document.querySelector('#TreinoNameForRead');
updateOption(TreinoNameForRead);


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

const ReadTreinamentoAdm = document.querySelector(".ReadTreinamentoAdm");

function displayTreinamentosRead(obj) {
    ReadTreinamentoAdm.innerHTML = "";
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `<table>
            <thead>
                <tr>
                    <th><b>Nome do treino</b></th>
                    <th><b>Código</b></th>
                    <th><b>Descrição</b></th>
                    <th><b>Carga Horária</b></th>
                </tr>
            </thead>
    
            <tbody>
                <tr>
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].codigo}</th>
                    <th>${obj[i].descricao}</th>
                    <th>${obj[i].carga_horaria}</th>
                </tr>
            <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Início das inscrições</b></th>
                        <th><b>Fim das inscrições</b></th>
                        <th><b>Início dos treinamentos</b></th>
                        <th><b>Fim dos treinamentos</b></th>
                    </tr>
                </thead>
    
            <tbody>
                    <tr>
                        <th>${obj[i].inicio_inscricoes}</th>
                        <th>${obj[i].fim_inscricoes}</th>
                        <th>${obj[i].inicio_treinamento}</th>
                        <th>${obj[i].fim_treinamento}</th>
                    </tr>
            <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Mínimo de inscritos</b></th>
                        <th><b>Máximo de inscritos</b></th>
                        <th><b>Nome Quiz de Aptidao</b></th>
                        <th><b>Nome Case 1</b></th>
                        <th><b>Nome Case 2</b></th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <th>${obj[i].min_inscritos}</th>
                        <th>${obj[i].max_inscritos}</th>
                        <th>${obj[i].QAptidao}</th>
                        <th>${obj[i].QCase1}</th>
                        <th>${obj[i].QCase2}</th>
                    </tr>
                <tbody>
    
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th><b>Texto Curso 1</b></th>
                        <th><b>Texto Curso 2</b></th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <th>${obj[i].Curso1}</th>
                        <th>${obj[i].Curso2}</th>
                    </tr>
                <tbody>
    
            </table>`;
            ReadTreinamentoAdm.appendChild(div);
        }
}

if(read_button_treino){
    read_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                var option = TreinoNameForRead.options[TreinoNameForRead.selectedIndex];
                var nome = option.value.split('_')[0]
                var cod = option.value.split('_')[1]
                obj = {
                    nome: nome.toUpperCase(),
                    cod: cod,
                }
                axios.post('http://localhost:3000/treinamento_read', obj)
                .then((response)=> {
                    displayTreinamentosRead(response.data)
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
