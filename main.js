const { app, BrowserWindow, ipcMain } = require('electron')

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



ipcMain.handle('some-name', async (event, cadastro) => {

  const mysql_pool = require('mysql2')
  const pool = mysql_pool.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: "schema1"
  });

  pool.connect(function(err) {
      if (err) throw err;
      console.log("conectou");
  });

  pool.query(`INSERT INTO Treinamento (codigo, nome_comercial, descricao, carga_horaria, inicio_inscricoes, fim_inscricoes, inicio_treinamento, fim_treinamento, min_inscritos, max_inscritos) VALUES ('${cadastro.codigo}', '${cadastro.nome_comercial}', '${cadastro.descricao}', '${cadastro.carga_horaria}', '${cadastro.inicio_inscricoes}', '${cadastro.fim_inscricoes}', '${cadastro.inicio_treinamento}', '${cadastro.fim_treinamento}', '${cadastro.min_inscritos}', '${cadastro.max_inscritos}');`);

  pool.end(() => {
      console.log("Connection succesfully closed");
  });
})

ipcMain.handle("res",async (event, res) => {
  console.log(res);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

