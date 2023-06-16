const { ipcRenderer } = require('electron');
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

const button_info_alunos = document.getElementById("display_info_alunos");

if(button_info_alunos){
  if(verificar()){
      try{
        button_info_alunos.addEventListener("click", (e) => {
              ipcRenderer.send('display_info_alunos');
      });
      }
      catch(e){
          console.log(e);
      }     
  }        
}

const button_crud = document.getElementById("display_crud_vagas");

if(button_crud){
  if(verificar()){
      try{
          button_crud.addEventListener("click", (e) => {
              ipcRenderer.send('display_crud');
      });
      }
      catch(e){
          console.log(e);
      }     
  }        
}

const button_LogOut = document.getElementById("LogOut");

if (button_LogOut) {
    button_LogOut.addEventListener('click', (e) => {
        try {
            if (verificar()) {
                ipcRenderer.send('Voltar_Login');
            }
        }
        catch(e){
            console.log(e);
        }
    })
}