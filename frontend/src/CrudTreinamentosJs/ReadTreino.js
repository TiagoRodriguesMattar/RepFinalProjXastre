const axios = require('axios');

const read_button_treino = document.getElementById('read_button_treinamento');
const TreinoNameForRead = document.querySelector('#TreinoNameForRead');
const TreinoCodForRead = document.querySelector('#TreinoCodForRead');

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
                    <th><b>Início das inscrições</b></th>
                    <th><b>Fim das inscrições</b></th>
                    <th><b>Início dos treinamentos</b></th>
                    <th><b>Fim dos treinamentos</b></th>
                    <th><b>Mínimo de inscritos</b></th>
                    <th><b>Máximo de inscritos</b></th>
                    <th><b>Nome Quiz de Aptidao</b></th>
                    <th><b>Nome Case 1</b></th>
                    <th><b>Nome Case 2</b></th>
                    <th><b>Texto Curso 1</b></th>
                    <th><b>Texto Curso 2</b></th>
                </tr>
            </thead>
    
            <tbody>
                <tr>
                    <th>${obj[i].nome_comercial}</th>
                    <th>${obj[i].codigo}</th>
                    <th>${obj[i].descricao}</th>
                    <th>${obj[i].carga_horaria}</th>
                    <th>${obj[i].inicio_inscricoes}</th>
                    <th>${obj[i].fim_inscricoes}</th>
                    <th>${obj[i].inicio_treinamento}</th>
                    <th>${obj[i].fim_treinamento}</th>
                    <th>${obj[i].min_inscritos}</th>
                    <th>${obj[i].max_inscritos}</th>
                    <th>${obj[i].QAptidao}</th>
                    <th>${obj[i].QCase1}</th>
                    <th>${obj[i].QCase2}</th>
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
                obj = {
                    nome: TreinoNameForRead.value.toUpperCase(),
                    cod: TreinoCodForRead.value,
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
