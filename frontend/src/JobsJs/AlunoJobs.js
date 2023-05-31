const axios = require('axios');

const jobs = document.querySelector(".jobs");

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
                div.innerHTML = `<p>
                Nome da vaga: ${obj[i].JobTitle}<br>
                Companhia: ${obj[i].Company}<br>
                Atividades: ${obj[i].Activities}<br>
                Requisitos: ${obj[i].Requiriments}<br>
                Salario: ${obj[i].Salary}<br>
                Vagas disponíveis: ${obj[i].MaxNumber}<br>
                </p>`;
                jobs.appendChild(div);
            }
        });
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

const UserSigninJobName = document.querySelector('#UserSigninJobName');
const UserSigninJobCompany = document.querySelector('#UserSigninJobCompany');
const CadUser = document.getElementById('CadUser');

if (CadUser) {
    CadUser.addEventListener('click', (e) => {
        e.preventDefault();
        if(verificar()) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const jobdata = {
                        nomeuser: response.data,
                        jobname: UserSigninJobName.value.toUpperCase(),
                        jobcompany: UserSigninJobCompany.value.toUpperCase()
                    }
                    axios.post('http://localhost:3000/CadUsuario', jobdata);
                })
            }
            catch(e) {
                console.log(e);
            }
        }
    })
}