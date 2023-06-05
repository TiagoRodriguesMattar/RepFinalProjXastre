const axios = require('axios');
const { ipcRenderer } = require('electron');

const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnContinuar = document.querySelector(".finish button");

function saveData(data) {
    localStorage.setItem('dataCase1', JSON.stringify(data));
}

const TreinoInfos = JSON.parse(localStorage.getItem('SpecificTreinamento'));

axios.post("http://localhost:3000/get-case1", TreinoInfos)
.then((res) => {
    saveData(res.data);
})

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
        const questions = JSON.parse(localStorage.getItem('dataCase1'));
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
        const questions = JSON.parse(localStorage.getItem('dataCase1'));
        textFinish.innerHTML = `você acertou ${questionsCorrect} de ${questions.length}`;
        content.style.display = "none";
        contentFinish.style.display = "flex";
        let res = questionsCorrect/questions.length;
        if (res > 0.7) {
            const user = JSON.parse(localStorage.getItem('user'));
            const UserInfos = { email: user.email, password: user.password };
            axios.post('http://localhost:3000/viewjobs', UserInfos)
            .then(response => {
                //console.log(response.data)
                const objeto = {
                    NomeAluno: response.data,
                    NomeQuiz: questions[0].NomeQuiz,
                    NumAcertos: questionsCorrect
                }
                console.log(objeto);
                axios.post('http://localhost:3000/HistAcertosQuiz', objeto);
            })
            btnContinuar.onclick = () => {
                if (verificar()) {
                    content.style.display = "flex";
                    contentFinish.style.display = "none";
                    
                    ipcRenderer.send('Janela_QuizCurso2')
                }
            };
        }
        else {
            console.log('Nota insuficiente');
        }
    }
}

function loadQuestion() {
    if (verificar()){
        const questions = JSON.parse(localStorage.getItem('dataCase1'));
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