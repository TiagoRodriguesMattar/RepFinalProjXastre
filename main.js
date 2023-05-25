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

function window_signup() {
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
  
  childWindow.loadFile("./cadastro.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_signup", (event, arg) => {
  window_signup();
});

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
  
  childWindow.loadFile("./LemePages/aluno.html");
  
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
  
  childWindow.loadFile("./LemePages/adm.html");
  
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
  
  childWindow.loadFile("./LemePages/moderador.html");
  
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
  
  childWindow.loadFile("./LemePages/empresas.html");
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

ipcMain.on("janela_empresa", (event, arg) => {
  windowempresa();
});

// Parte CRUD vagas de emprego

function windowJobsAllOptions() {
    childWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }, 
    });

    childWindow.loadFile("index2.html");

    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });
}

ipcMain.on("Janela_JobsAllOptions", (event, arg) => {
    windowJobsAllOptions();
});

//Janela de cadastro de uma nova vaga de emprego (EMPRESA)

const NewJobWindow = () => {
    childWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        modal: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
    });

    childWindow.loadFile("./GuitosPages/newJob.html");
  
    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });
}

ipcMain.on("Janela_NewJob", (event, args) => {
    NewJobWindow();
});

//Janela de edição de uma nova vaga de emprego (EMPRESA)

const editJobWindow = () => {
    childWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        modal: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
    });

    childWindow.loadFile("./GuitosPages/editJob.html");

    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });
}

ipcMain.on("Janela_EditJob", (event, args) => {
    editJobWindow();
});

//Janela de leitura das vagas de emprego (EMPRESA)

const ReadJobWindow = () => {
  childWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
  });

  childWindow.loadFile("./GuitosPages/readJob.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_ReadJob", (event, args) => {
    ReadJobWindow();
});

//Janela de deleção das vagas de emprego (EMPRESA)

const DeleteJobWindow = () => {
  childWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
  });

  childWindow.loadFile("./GuitosPages/deleteJob.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_DeleteJob", (event, args) => {
    DeleteJobWindow();
});

// banco de dados (invokes)

// https://api-dados.herokuapp.com/signin --> n existe mais
ipcMain.handle('cadastro', async (event, dados) => {
  //console.log(dados);
  axios.post('http://localhost:3000/signin', dados)
  .then((response)=> {
    //console.log(response)
  },(error) => {
    console.log("entrou aqui --")
    console.log(error);
  })
})

// https://api-dados.herokuapp.com/login
ipcMain.handle('login', async (event, dados) => {
  console.log("entrei aqui porra");
  axios.post('http://localhost:3000/login', dados)
  .then((res)=> {
    console.log(res.data.accessToken);
  },(error) => {
    console.log(error);
  })  
})

ipcMain.handle('NewJobChannel', async (event, jobdata) => {
    console.log(jobdata);
    axios.post('http://localhost:3000/newjob', jobdata)
    .then((response)=> {
      console.log("deu certo");
    },(error) => {
      console.log(error);
    })
})

ipcMain.handle('EditJobChannel', async (event, editedjobdata) => {
    axios.post('http://localhost:3000/editjob', editedjobdata)
    .then((response)=> {
      console.log("deu bom");
    },(error) => {
      console.log(error);
    })
})

ipcMain.handle('ReadJobChannel', async (event, readjobdata) => {
    axios.post('http://localhost:3000/readjob', readjobdata)
    .then((response)=> {
      console.log("deu bom");
    },(error) => {
      console.log(error);
    })
})

ipcMain.handle('DeleteJobChannel', async (event, deletejobdata) => {
    axios.post('http://localhost:3000/deletejob', deletejobdata)
    .then((response)=> {
      console.log("deu bom");
    },(error) => {
      console.log(error);
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})