const axios = require('axios');

const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");

function saveData(data) {
    localStorage.setItem('dataQuiz', JSON.stringify(data));
}

axios.get("http://localhost:3000/get-quiz")
.then((res) => {
    saveData(res.data);
})

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

let currentIndex = 0;
let questionsCorrect = 0;

btnRestart.onclick = () => {
    if (verificar()) {
        content.style.display = "flex";
        contentFinish.style.display = "none";
    
        currentIndex = 0;
        questionsCorrect = 0;
        loadQuestion();
    }
};

function nextQuestion(e) {
    if(verificar()) {
        const questions = JSON.parse(localStorage.getItem('dataQuiz'));
        if (e.target.getAttribute("data-correct") === "true") {
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
        const questions = JSON.parse(localStorage.getItem('dataQuiz'));
        textFinish.innerHTML = `você acertou ${questionsCorrect} de ${questions.length}`;
        content.style.display = "none";
        contentFinish.style.display = "flex";
        const user = JSON.parse(localStorage.getItem('user'));
        const UserInfos = { email: user.email, password: user.password };
        axios.post('http://localhost:3000/viewjobs', UserInfos)
        .then(response => {
            console.log(response.data)
            const objeto = {
                NomeAluno: response.data,
                NomeQuiz: questions[0].NomeQuiz,
                NumAcertos: questionsCorrect
            }
            axios.post('http://localhost:3000/HistAcertosQuiz', objeto);
        })
    }
}

function loadQuestion() {
    if (verificar()){
        const questions = JSON.parse(localStorage.getItem('dataQuiz'));
        spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
        const item = questions[currentIndex];
        answers.innerHTML = "";
        question.innerHTML = item.PerguntaQuiz;
    
         const obj = [
          { option: item.RespostaE1, correct: false },
          { option: item.RespostaE2, correct: false},
          { option: item.RespostaE3, correct: false},
          { option: item.RespostaCorreta, correct: true}
        ]
    
        for(let i = 0; i < obj.length; i++) {
            const div = document.createElement("div");
            div.innerHTML = `
            <button class="answer" data-correct="${obj[i].correct}">
            ${obj[i].option}
            </button>
            `;
            answers.appendChild(div);
        }
    
        document.querySelectorAll(".answer").forEach((item) => {
            item.addEventListener("click", nextQuestion);
        });
    }
}

loadQuestion();