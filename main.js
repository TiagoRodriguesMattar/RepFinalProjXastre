const { app, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios');

let MainWindow;
let childWindow;

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

    MainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
})

//Janela de cadastro de uma nova vaga de emprego (EMPRESA)

const NewJobWindow = () => {
    childWindow = new BrowserWindow({
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

    childWindow.loadFile("./pages/newJob.html");
  
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
        parent: MainWindow, 
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
    });

    childWindow.loadFile("./pages/editJob.html");

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
      parent: MainWindow, 
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
  });

  childWindow.loadFile("./pages/readJob.html");

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
      parent: MainWindow, 
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
  });

  childWindow.loadFile("./pages/deleteJob.html");

  childWindow.once("ready-to-show", () => {
      childWindow.show();
  });
}

ipcMain.on("Janela_DeleteJob", (event, args) => {
    DeleteJobWindow();
});

//Invokes

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