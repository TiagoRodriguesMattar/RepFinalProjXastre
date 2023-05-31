const axios = require('axios');
const { ipcRenderer } = require('electron');

const ViewJobs_button = document.getElementById("ViewJobs");
const delete_button = document.getElementById('delete_button');
const deleteJobTitle = document.querySelector('#OldJobTitle');

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

if(ViewJobs_button) {
    ViewJobs_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                //console.log(obj);
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    localStorage.setItem('Username', JSON.stringify(response.data));
                    axios.post('http://localhost:3000/readjob', response)
                })
            }
        }
        catch(e) {
            console.log(e);
        }
    })
}

if(delete_button) {
    delete_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                const obj = {
                    JobName: deleteJobTitle.value,
                    JobCompany: JSON.parse(localStorage.getItem('Username'))
                }
                axios.post('http://localhost:3000/deletejob', obj)                
                .then((response)=> {
                }, (error) => {
                    console.log(error);
                })
            }
            else
                console.log('acesso negado');
        } 
        catch (e) {
            console.log(e);
        }
    })
}