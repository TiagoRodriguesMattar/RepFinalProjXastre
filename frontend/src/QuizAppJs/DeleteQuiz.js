const axios = require('axios');

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

const ViewQuizzes_button = document.getElementById('ViewQuizzes');

if (ViewQuizzes_button) {
    ViewQuizzes_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                axios.get('http://localhost:3000/VerAllQuiz');
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

const QuizTitle = document.querySelector('#QuizTitle');
const delete_button_quiz = document.getElementById('delete_button_quiz');

if (delete_button_quiz) {
    delete_button_quiz.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                const obj = {
                    Nome: QuizTitle.value.toUpperCase(),
                }
                axios.post('http://localhost:3000/DeleteQuiz', obj);
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}