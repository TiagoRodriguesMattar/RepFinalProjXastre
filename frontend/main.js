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

// Parte do aluno das vagas de emprego

function windowAlunoJobs() {
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

  childWindow.loadFile("JobsAlunoHome.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_AlunoJobs", (event, arg) => {
  windowAlunoJobs();
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

    childWindow.loadFile("JobsEmpresaAllOptions.html");

    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });
}

ipcMain.on("display_crud", (event, arg) => {
    windowJobsAllOptions();
});


function windowJobsHome() {
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

  childWindow.loadFile("HomeEmpresas.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_HomeEmpresas", (event, arg) => {
  windowJobsHome();
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

    childWindow.loadFile("./JobsPages/newJob.html");
  
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

    childWindow.loadFile("./JobsPages/editJob.html");

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

  childWindow.loadFile("./JobsPages/readJob.html");

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

  childWindow.loadFile("./JobsPages/deleteJob.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_DeleteJob", (event, args) => {
    DeleteJobWindow();
});

//Janela de deleção das vagas de emprego (EMPRESA)

const ListStudentsJobWindow = () => {
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

  childWindow.loadFile("./JobsPages/listStudents.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_ListStudents", (event, args) => {
    ListStudentsJobWindow();
});

const QuizAppWindow = () => {
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

  childWindow.loadFile("./TreinamentosPages/quiz.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizApp", (event, args) => {
    QuizAppWindow();
});

const AlunoTreinamentosWindow = () => {
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

  childWindow.loadFile("./TreinamentoAlunoHome.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_AlunoTreinamentos", (event, args) => {
    AlunoTreinamentosWindow();
});

// Página que aparece para o aluno depois do LOGIN

const HomeAluno = () => {
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

  childWindow.loadFile("./NiveisDePermissao/Aluno.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_HomeAlunoPerm", (event, args) => {
    HomeAluno();
});

// Página que aparece para o administrador depois do LOGIN

const HomeAdministrador = () => {
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

  childWindow.loadFile("./NiveisDePermissao/Administrador.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("janela_HomeAdmPerm", (event, args) => {
    HomeAdministrador();
});

// Páginas CRUD treinamento
// Create treinamento
const NewTreinoWindow = () => {
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

  childWindow.loadFile("./TreinamentosPages/NewTreinamento.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("janela_NewTreinoWindow", (event, args) => {
    NewTreinoWindow();
});

// Update treinamento
const UpdateTreinoWindow = () => {
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

  childWindow.loadFile("./TreinamentosPages/EditTreinamento.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("janela_EditTreinoWindow", (event, args) => {
    UpdateTreinoWindow();
});

// Read treinamento
const ReadTreinoWindow = () => {
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

  childWindow.loadFile("./TreinamentosPages/ReadTreinamento.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("janela_ReadTreinoWindow", (event, args) => {
  ReadTreinoWindow();
});

// banco de dados (invokes)

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})