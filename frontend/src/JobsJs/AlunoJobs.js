const axios = require('axios');
const {ipcRenderer} = require('electron');

const jobs = document.querySelector(".jobs");

function Objetovazio(obj) {
    for (var prop in obj) {
      if(obj.hasOwnProperty(prop)) 
        return false
    }
    return true;
}

function displayVagas() {
        /*const questions = JSON.parse(localStorage.getItem('dataQuiz'));
        spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
        const item = questions[currentIndex];
        question.innerHTML = item.PerguntaQuiz;*/
        jobs.innerHTML = "";
        axios.post("http://localhost:3000/readAlljob")
        .then(response => {
            const obj = response.data;
            for(let i = 0; i < obj.length; i++) {
                const div = document.createElement("div");
                div.innerHTML = `<table>
                <thead>
                    <tr>
                        <th><b>Nome da vaga</b></th>
                        <th><b>Companhia</b></th>
                        <th><b>Atividades</b></th>
                        <th><b>Requisitos</b></th>
                        <th><b>Salario</b></th>
                        <th><b>Vagas Disponíveis</b></th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>${obj[i].JobTitle}</th>
                        <th>${obj[i].Company}</th>
                        <th>${obj[i].Activities}</th>
                        <th>${obj[i].Requiriments}</th>
                        <th>R$${obj[i].Salary}.00</th>
                        <th>${obj[i].MaxNumber}</th>
                    </tr>
                <tbody>

                </table>`;
                jobs.appendChild(div);
            }
        });
}

const StatusCad = document.querySelector(".StatusCad");

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

const AllJobsList = document.getElementById('AllJobsList');

if(AllJobsList){
    AllJobsList.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                //axios.post('http://localhost:3000/readAllJob');
                displayVagas();
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

function updateOption(select){
    axios.post("http://localhost:3000/readAlljob")
    .then(response => {
        const obj = response.data;
        for(let i=0;i<select.length;i++){
            select.options.remove(0)
        }
        for(let i=0; i<obj.length;i++){
            var c = document.createElement("option");
            c.value = `${obj[i].JobTitle}_${obj[i].Company}`;
            c.text = obj[i].JobTitle;
            console.log(c)
            select.options.add(c,i);
        }
    })
}

const UserSigninJobName = document.querySelector('#UserSigninJobName')

updateOption(UserSigninJobName);
//const UserSigninJobCompany = document.querySelector('#UserSigninJobCompany');
const CadUser = document.getElementById('CadUser');

if (CadUser) {
    CadUser.addEventListener('click', (e) => {
        e.preventDefault();
        if(verificar()) {
            try {
                var select = document.getElementById('UserSigninJobName');
	            var option = select.options[select.selectedIndex];
                var nome = option.value.split("_")[0];
                console.log("\n"+nome)
                var empresa = option.value.split("_")[1];
                console.log("\n"+empresa)
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const jobdata = {
                        nomeuser: response.data,
                        jobname: nome.toUpperCase(),
                        jobcompany: empresa.toUpperCase()
                    }
                    axios.post('http://localhost:3000/CadUsuario', jobdata)
                    .then(response => {
                        if (response.data.valor === '1')
                            alert('Aluno Cadastrado com sucesso!')
                        else
                            alert('Erro no cadastro do aluno!')
                    })
                })
            }
            catch(e) {
                console.log(e);
            }
        }
    })
}

const VoltarHomeAluno_button = document.getElementById("VoltarHomeAluno");

if(VoltarHomeAluno_button) { 
    VoltarHomeAluno_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('Janela_HomeAlunoPerm');
        }
        catch{
            console.log(e);
        }
    })
}