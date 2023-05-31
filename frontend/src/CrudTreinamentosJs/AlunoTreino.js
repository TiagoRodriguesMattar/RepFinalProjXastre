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

const ViewTreinamentos_button = document.getElementById('ViewTreinamentos');

if (ViewTreinamentos_button) {
    ViewTreinamentos_button.addEventListener('click', (e)=>{
        e.preventDefault();
        try {
            if(verificar()) {
                axios.get('http://localhost:3000/ViewAllTreinamentos');
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}