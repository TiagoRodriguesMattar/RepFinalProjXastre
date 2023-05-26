const { ipcRenderer } = require('electron');

const delete_button = document.getElementById('delete_button');
const deleteJobTitle = document.querySelector('#DeleteJobTitle');

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

if(delete_button) {
    delete_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if(verificar()) {
                obj = {
                    JobName: deleteJobTitle.value,
                    JobCompany: CompanyNameForRead.value
                }
                ipcRenderer.invoke('DeleteJobChannel', obj);
            }
            else
                console.log('acesso negado');
        } 
        catch (e) {
            console.log(e);
        }
    })
}