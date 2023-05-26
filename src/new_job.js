const axios = require('axios');
const register_button = document.getElementById("register_button");

const JobTitle = document.querySelector('#JobTitle');
const Company = document.querySelector('#Company');
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
                const obj = {
                    JobTitle: JobTitle.value,
                    JobCompany: Company.value,
                    JobActivities: Activities.value,
                    JobRequiriments: Requiriments.value,
                    JobSalary: Salary.value,
                    JobMaxNumber: MaxNumber.value
                }
                axios.post('http://localhost:3000/newjob', obj)
                .then((response)=> {
                console.log("deu certo");
                },(error) => {
                console.log(error);
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