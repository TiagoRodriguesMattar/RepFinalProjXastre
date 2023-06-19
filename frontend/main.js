const { app, BrowserWindow, ipcMain, remote } = require('electron');  
const { authPlugins } = require('mysql2');
const axios = require('axios').default;


let mainwindow;

function navegate(name,window){
    window.loadFile(name);
}


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

  
  mainwindow.loadFile('./index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on("Voltar_Login", (event, arg) => {
  navegate("./index.html", mainwindow)
});

ipcMain.on("janela_signup", (event, arg) => {
  navegate('./cadastro.html',mainwindow);

});

// Parte do aluno das vagas de emprego

ipcMain.on("Janela_AlunoJobs", (event, arg) => {
  navegate("./JobsPages/JobsAlunoHome.html",mainwindow)

});

// Parte CRUD vagas de emprego


ipcMain.on("display_crud", (event, arg) => {
  navegate("./JobsPages/JobsEmpresaAllOptions.html",mainwindow)
 
});


ipcMain.on("display_vagas_adm", (event, arg) => {
  navegate("./JobsPages/JobsAdmHome.html",mainwindow)

});

// display atividades alunos parte da empresa


ipcMain.on("display_info_alunos", (event, arg) => {
  navegate("./AlunoProfile/AlunoInfo.html",mainwindow)
});

// Parte CRUD treinamentos

ipcMain.on("display_crud_treinamento", (event, arg) => {
  navegate("./TreinamentosPages/indexTreinamentoCrud.html",mainwindow)
});

ipcMain.on("display_hist_alunos", (event, arg) => {
  navegate("./AlunoProfile/HistAlunoAdm.html",mainwindow)
});

// Montagem do Quiz - parte do ADM


ipcMain.on("display_crud_quiz", (event, arg) => {
  navegate("./TreinamentosPages/QuizAdm/indexQuizCrud.html",mainwindow)
});


ipcMain.on("display_montar_Quiz", (event, arg) => {
  navegate("./TreinamentosPages/QuizAdm/MontarQuizAdm.html",mainwindow)
});


ipcMain.on("display_delete_Quiz", (event, arg) => {
  navegate("./TreinamentosPages/QuizAdm/DeleteQuizAdm.html",mainwindow)
});

ipcMain.on("Janela_HomeEmpresas", (event, arg) => {
  navegate("./NiveisDePermissao/HomeEmpresas.html",mainwindow);
});

//Janela de cadastro de uma nova vaga de emprego (EMPRESA)

ipcMain.on("Janela_NewJob", (event, args) => {
  navegate("./JobsPages/newJob.html",mainwindow);
});

//Janela de edição de uma nova vaga de emprego (EMPRESA)

ipcMain.on("Janela_EditJob", (event, args) => {
  navegate("./JobsPages/editJob.html",mainwindow);
});

//Janela de leitura das vagas de emprego (EMPRESA)


ipcMain.on("Janela_ReadJob", (event, args) => {
  navegate("./JobsPages/readJob.html",mainwindow);
});

//Janela de deleção das vagas de emprego (EMPRESA)


ipcMain.on("Janela_DeleteJob", (event, args) => {
  navegate("./JobsPages/deleteJob.html",mainwindow);
});

//Janela de deleção das vagas de emprego (EMPRESA)


ipcMain.on("Janela_ListStudents", (event, args) => {
  navegate("./JobsPages/listStudents.html",mainwindow);
});

ipcMain.on("Janela_QuizApp", (event, args) => {
  navegate("./QuizPages/quiz.html",mainwindow);
});

ipcMain.on("Janela_QuizCurso1", (event, args) => {
  navegate("./QuizPages/Curso1.html",mainwindow);
});

ipcMain.on("Janela_QuizCase1APP", (event, args) => {
  navegate("./QuizPages/case1.html",mainwindow);
});

ipcMain.on("Janela_QuizCurso2", (event, args) => {
  navegate("./QuizPages/Curso2.html",mainwindow);
});


ipcMain.on("Janela_QuizCase2APP", (event, args) => {
  navegate("./QuizPages/case2.html",mainwindow);
});

ipcMain.on("Janela_alunoTestes", (event, args) => {
  navegate("./TreinamentosPages/TestesAluno.html",mainwindow);
});

ipcMain.on("Janela_alunoProfile", (event, args) => {
  navegate("./AlunoProfile/Aluno_profile.html",mainwindow);
});

ipcMain.on("Janela_AlunoTreinamentos", (event, args) => {
  navegate("./TreinamentosPages/TreinamentoAlunoHome.html",mainwindow);
});

// Página que aparece para o aluno depois do LOGIN

ipcMain.on("Janela_HomeAlunoPerm", (event, args) => {
  navegate("./NiveisDePermissao/Aluno.html", mainwindow);
});

// Página que aparece para o administrador depois do LOGIN

ipcMain.on("janela_HomeAdmPerm", (event, args) => {
  navegate("./NiveisDePermissao/Administrador.html",mainwindow);
});

// Página que aparece para o mentor depois do LOGIN


ipcMain.on("janela_HomeMentor", (event, args) => {
  navegate("./NiveisDePermissao/Mentor.html",mainwindow)
});


// Páginas CRUD treinamento
// Create treinamento

ipcMain.on("janela_NewTreinoWindow", (event, args) => {
  navegate("./TreinamentosPages/NewTreinamento.html",mainwindow);
});

// Update treinamento

ipcMain.on("janela_EditTreinoWindow", (event, args) => {
  navegate("./TreinamentosPages/EditTreinamento.html",mainwindow);
});

// Delete treinamento

ipcMain.on("Janela_DeleteTreinamento", (event, args) => {
  navegate("./TreinamentosPages/DeleteTreinamento.html",mainwindow);
});

// Read treinamento

ipcMain.on("janela_ReadTreinoWindow", (event, args) => {
  navegate("./TreinamentosPages/ReadTreinamento.html",mainwindow);
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