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

function AtvFunction() { 
    var x = document.getElementById("atvs"); 
    if (x.style.display === "none") { 
      x.style.display = "block"; 
    } else { 
      x.style.display = "none"; 
    } 
  } 
  
  function NotasFunction() { 
    var x = document.getElementById("nota"); 
    if (x.style.display === "none") { 
      x.style.display = "block"; 
    } else { 
      x.style.display = "none"; 
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