const axios = require('axios');
const { ipcRenderer } = require('electron');

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

const NomeQuiz = document.querySelector('#QuizName');
const NumPerg = document.querySelector('#QuizNumPerg');
const button_proximo = document.getElementById('StartMontagem');

const PerguntasRespostas = [{
    Resp1: '',
    Resp2: '',
    Resp3: '',
    Resp4: '',
    RespCorreta: '',
}];

if (button_proximo) {
    button_proximo.addEventListener('click', () => {
        try {
            if (verificar()) {
                for (let i = 0; i < NumPerg.value; i++) {
                    // innel HTML aqui dentro
                }
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

