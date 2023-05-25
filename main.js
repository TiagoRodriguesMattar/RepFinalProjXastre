const { app, BrowserWindow, ipcMain } = require('electron')

const axios = require('axios');

let MainWindow;
let ChildWindow;

const createWindow = () => {
  MainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  MainWindow.loadFile('./index.html');
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

const CadastroWindow = () => {
  ChildWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: MainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  ChildWindow.loadFile("./RicardoPages/pag1.html");
  
  ChildWindow.once("ready-to-show", () => {
      ChildWindow.show();
  });

}

ipcMain.on("JanelaCadastro", (event, args) => {
  CadastroWindow();
});

const AcessoQuiz= () => {
  ChildWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: MainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  ChildWindow.loadFile("./RicardoPages/BuscaQuiz.html");
  
  ChildWindow.once("ready-to-show", () => {
      ChildWindow.show();
  });

}

ipcMain.on("JanelaAcessoQuiz", (event, args) => {
  AcessoQuiz();
});



const QuizWindow = () => {
  ChildWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: MainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  ChildWindow.loadFile("./RicardoPages/pag2.html");
  
  ChildWindow.once("ready-to-show", () => {
      ChildWindow.show();
  });

}

ipcMain.on("JanelaQuiz", (event, args) => {
  QuizWindow();
});



ipcMain.handle('treino-bd', async (event, cadastro) => {
    axios.post('http://localhost:3000/treinamento',cadastro)
    .then((res) => {
      console.log(res);
    })
})

ipcMain.handle('quiz-bd', async (event, InfoQuiz) => {
  axios.post('http://localhost:3000/quiz',InfoQuiz)
  .then((res) => {
    console.log(res);
  })
})

ipcMain.handle("res",async (event, res) => {
  console.log(res);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

