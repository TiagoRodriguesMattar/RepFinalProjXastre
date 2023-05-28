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

const AllJobsList = document.getElementById('AllJobsList');

if(AllJobsList){
    AllJobsList.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                axios.post('http://localhost:3000/readAllJob')
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}