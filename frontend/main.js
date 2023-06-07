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

  childWindow.loadFile("./JobsPages/JobsAlunoHome.html");

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

    childWindow.loadFile("./JobsPages/JobsEmpresaAllOptions.html");

    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });
}

ipcMain.on("display_crud", (event, arg) => {
    windowJobsAllOptions();
});

// display atividades alunos parte da empresa

function windowAlunosInfoEmpresa() {
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

  childWindow.loadFile("./AlunoProfile/AlunoInfo.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("display_info_alunos", (event, arg) => {
  windowAlunosInfoEmpresa();
});

// Parte CRUD treinamentos

function TreinamentoCrudWindow() {
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

  childWindow.loadFile("./TreinamentosPages/indexTreinamentoCrud.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("display_crud_treinamento", (event, arg) => {
  TreinamentoCrudWindow();
});

// Montagem do Quiz - parte do ADM

function QuizCrudWindow() {             // CRUD quiz
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

  childWindow.loadFile("./TreinamentosPages/QuizAdm/indexQuizCrud.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("display_crud_quiz", (event, arg) => {
  QuizCrudWindow();
});

function MontarQuizWindow() {
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

  childWindow.loadFile("./TreinamentosPages/QuizAdm/MontarQuizAdm.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("display_montar_Quiz", (event, arg) => {
  MontarQuizWindow();
});

function DeleteQuizWindow() {
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

  childWindow.loadFile("./TreinamentosPages/QuizAdm/DeleteQuizAdm.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("display_delete_Quiz", (event, arg) => {
  DeleteQuizWindow();
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

  childWindow.loadFile("./NiveisDePermissao/HomeEmpresas.html");

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

  childWindow.loadFile("./QuizPages/quiz.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizApp", (event, args) => {
    QuizAppWindow();
});

const QuizCurso1Window = () => {
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

  childWindow.loadFile("./QuizPages/Curso1.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizCurso1", (event, args) => {
    QuizCurso1Window();
});

const QuizCase1AppWindow = () => {
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

  childWindow.loadFile("./QuizPages/case1.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizCase1APP", (event, args) => {
  QuizCase1AppWindow();
});

const QuizCurso2Window = () => {
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

  childWindow.loadFile("./QuizPages/Curso2.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizCurso2", (event, args) => {
    QuizCurso2Window();
});

const QuizCase2AppWindow = () => {
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

  childWindow.loadFile("./QuizPages/case2.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_QuizCase2APP", (event, args) => {
  QuizCase2AppWindow();
});

const SelectTestesAluno = () => {
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

  childWindow.loadFile("./TreinamentosPages/TestesAluno.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_alunoTestes", (event, args) => {
    SelectTestesAluno();
});

const SelectProfileAluno = () => {
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

  childWindow.loadFile("./AlunoProfile/Aluno_profile.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_alunoProfile", (event, args) => {
  SelectProfileAluno();
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

  childWindow.loadFile("./TreinamentosPages/TreinamentoAlunoHome.html");

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

// Delete treinamento
const DeleteTreinoWindow = () => {
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

  childWindow.loadFile("./TreinamentosPages/DeleteTreinamento.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_DeleteTreinamento", (event, args) => {
  DeleteTreinoWindow();
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