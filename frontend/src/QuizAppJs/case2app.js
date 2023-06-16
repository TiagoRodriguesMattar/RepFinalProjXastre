const axios = require('axios');
const { ipcRenderer } = require('electron');

const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnContinuar = document.querySelector(".finish button");

/*function saveData(data) {
    localStorage.setItem('dataCase2', JSON.stringify(data));
}

const TreinoInfos = JSON.parse(localStorage.getItem('SpecificTreinamento'));

axios.post("http://localhost:3000/get-case2", TreinoInfos)
.then((res) => {
    saveData(res.data);
})*/

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

let currentIndex = 0;
let questionsCorrect = 0;

function nextQuestion(e, ItemClick) {
    if(verificar()) {
        const questions = JSON.parse(localStorage.getItem('dataCase2'));
        if (e.target.getAttribute("data-correct") === ItemClick) {
            questionsCorrect++;
        }
    
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            loadQuestion();
        } else {
            finish();
        }
    }
}

function finish() {
    if (verificar()) {
        const user = JSON.parse(localStorage.getItem('user'));
        const SpecificTreinamento = JSON.parse(localStorage.getItem('SpecificTreinamento'));  
        const questions = JSON.parse(localStorage.getItem('dataCase2'));
        textFinish.innerHTML = `você acertou ${questionsCorrect} de ${questions.length}`;
        content.style.display = "none";
        contentFinish.style.display = "flex";
        let res = questionsCorrect/questions.length;
        if (res > 0.7) {
                     
            const UserInfos = { email: user.email, password: user.password };
            axios.post('http://localhost:3000/viewjobs', UserInfos)
            .then(response => {
                //console.log(response.data)
                const objeto = {
                    NomeAluno: response.data,
                    NomeQuiz: questions[0].NomeQuiz,
                    NumAcertos: questionsCorrect
                }
                axios.post('http://localhost:3000/HistAcertosQuiz', objeto);

                const TreinoInfo = {
                    treinoname: SpecificTreinamento.Nome,
                    nomeuser: response.data,
                    status: '2' 
                };
                axios.post('http://localhost:3000/UpdateStatusTreino', TreinoInfo);
            })
            btnContinuar.onclick = () => {
                if (verificar()) {
                    content.style.display = "flex";
                    contentFinish.style.display = "none";
                    
                    ipcRenderer.send("Janela_AlunoJobs");
                }
            };
        }
        else {
            console.log('Nota insuficiente');
            const UserInfos = { email: user.email, password: user.password };
            axios.post('http://localhost:3000/viewjobs', UserInfos)
            .then(response => {
                const TreinoInfo = {
                    treinoname: SpecificTreinamento.Nome,
                    nomeuser: response.data,
                    status: '3' 
                };
                axios.post('http://localhost:3000/UpdateStatusTreino', TreinoInfo);
            })

            btnContinuar.onclick = () => {
                if (verificar()) { 
                    ipcRenderer.send("Janela_alunoTestes");
                }
            };
        }
    }
}

function loadQuestion() {
    if (verificar()){
        const questions = JSON.parse(localStorage.getItem('dataCase2'));
        //console.log(questions);
        spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
        const item = questions[currentIndex];
        answers.innerHTML = "";
        question.innerHTML = item.PerguntaQuiz;

         const obj = [
          { option: item.RespostaE1 },
          { option: item.RespostaE2 },
          { option: item.RespostaE3 },
          { option: item.RespostaE4 },
        ]
    
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `
            <button class="answer" data-correct="${item.RespostaCorreta}">
            ${obj[i].option}
            </button>
            `;
            answers.appendChild(div);
        }
    
        document.querySelectorAll(".answer").forEach((item) => {
            item.addEventListener("click", (e) => {
                //console.log(item.innerText);
                nextQuestion(e, item.innerText);
            });
        });
    }
}

loadQuestion();