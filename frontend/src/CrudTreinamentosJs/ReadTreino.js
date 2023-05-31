const axios = require('axios');

const read_button_treino = document.getElementById('read_button_treinamento');
const TreinoNameForRead = document.querySelector('#TreinoNameForRead');

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

if(read_button_treino){
    read_button_treino.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                obj = {
                    data: TreinoNameForRead.value.toUpperCase(),
                }
                axios.post('http://localhost:3000/treinamento_read', obj)
                .then((response)=> {
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
