const axios = require('axios');
const { ipcRenderer } = require('electron');

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

const NomeQuiz = document.querySelector('#QuizName');
const button_cadQuest = document.getElementById('cadquest');
const perg = document.querySelector('#Perg');
const resp1 = document.querySelector('#Resp1');
const resp2 = document.querySelector('#Resp2');
const resp3 = document.querySelector('#Resp3');
const resp4 = document.querySelector('#Resp4');
const respcor = document.querySelector('#RespCorreta');
const codcurso = document.querySelector('#Codtreino');

if (button_cadQuest) {
    button_cadQuest.addEventListener('click', () => {
        try {
            if (verificar()) {
                const PerguntasRespostas = {
                    Perg: perg.value.toUpperCase(),
                    Resp1: resp1.value.toUpperCase(),
                    Resp2: resp2.value.toUpperCase(),
                    Resp3: resp3.value.toUpperCase(),
                    Resp4: resp4.value.toUpperCase(),
                    RespCorreta: respcor.value.toUpperCase(),
                    nomequiz: NomeQuiz.value.toUpperCase(),
                    codigo: codcurso.value, 
                };
                axios.post('http://localhost:3000/CadQuestaoQuiz', PerguntasRespostas);
            }
            else {
                console.log('Acesso negado');
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}