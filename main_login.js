const { app, BrowserWindow, ipcMain } = require('electron');  
const { authPlugins } = require('mysql2');
const axios = require('axios').default;


let mainwindow;

 function createWindow () {
    mainwindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainwindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// janela aluno

function windowaluno() {
  childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: mainwindow, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  

  childWindow.loadFile("aluno.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_aluno", (event, arg) => {
  windowaluno();
});

// janela adm

function windowadm() {
  childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: mainwindow, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }, 
  });
  

  childWindow.loadFile("adm.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_adm", (event, arg) => {
  try{
    axios.get
    windowadm();
  }catch(e){

  }
  
});
// janela moderador

function windowmod() {
  childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: mainwindow, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }, 
  });
  

  childWindow.loadFile("moderador.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_mod", (event, arg) => {
  windowmod();
});

// login empresa

function windowempresa() {
  childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: mainwindow, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }, 
  });
  

  childWindow.loadFile("empresas.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_empresa", (event, arg) => {
  windowempresa();
});


// banco de dados

ipcMain.handle('some-name', async (event, dados) => {
  console.log(dados);
  axios.post('https://api-dados.herokuapp.com/signin',dados)
  .then((response)=> {
    console.log(response)

  },(error) => {
    console.log(error);
  })
 
})


ipcMain.handle('login', async (event, dados) => {
  axios.post('https://api-dados.herokuapp.com/login',dados)
  .then((res)=> {
    console.log(res.data.accessToken);
  },(error) => {
    console.log(error);
  })
      
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})