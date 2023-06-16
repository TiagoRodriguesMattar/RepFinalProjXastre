const axios = require('axios');
const {ipcRenderer} = require('electron');

const register_button = document.getElementById("register_button");

const JobTitle = document.querySelector('#JobTitle');
const Activities = document.querySelector('#Activities');
const Requiriments = document.querySelector('#Requiriments');
const Salary = document.querySelector('#Salary');
const MaxNumber = document.querySelector('#MaxNumber');

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

if(register_button){
    register_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const UserInfos = { email: user.email, password: user.password };
                axios.post('http://localhost:3000/viewjobs', UserInfos)
                .then(response => {
                    const obj = {
                        JobTitle: JobTitle.value.toUpperCase(),
                        JobCompany: response.data.toUpperCase(),
                        JobActivities: Activities.value.toUpperCase(),
                        JobRequiriments: Requiriments.value.toUpperCase(),
                        JobSalary: Salary.value,
                        JobMaxNumber: MaxNumber.value
                    }
                    axios.post('http://localhost:3000/newjob', obj)
                    .then((response)=> {
                    },(error) => {
                        console.log(error);
                    })
                })
            }
            else
                console.log('acesso negado');
        }
        catch{
            console.log(e);
        }
    })
}

const VoltarCrudVagas_button = document.getElementById("VoltarCrudVagas");

if(VoltarCrudVagas_button) { 
    VoltarCrudVagas_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('display_crud');
        }
        catch{
            console.log(e);
        }
    })
}