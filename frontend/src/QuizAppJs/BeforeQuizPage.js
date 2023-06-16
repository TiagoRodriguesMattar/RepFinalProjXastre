const axios = require('axios');
const { ipcRenderer } = require('electron');

function verificar() {
    var auth = true;

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

/*function saveData(data) {
    localStorage.setItem('dataQuiz', JSON.stringify(data));
}*/

const treinamentosCadAlunos = document.querySelector(".treinamentosCadAlunos");

function displayTreinamentos(obj) {
    console.log(obj);
    treinamentosCadAlunos.innerHTML = "";
    for(let i = 0; i < obj.length; i++) {
        const div = document.createElement("div");
        div.innerHTML = `<table>
        <thead>
            <tr>
                <th><b>Nome do treino</b></th>
                <th><b>Código</b></th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <th>${obj[i].treinoname}</th>
                <th>${obj[i].treinocodigo}</th>
            </tr>
        <tbody>

        </table>`;
        treinamentosCadAlunos.appendChild(div);
    }
}

const ViewCadTreinamentosAlunos_button = document.getElementById('ViewCadTreinamentosAlunos');

if (ViewCadTreinamentosAlunos_button) {
    ViewCadTreinamentosAlunos_button.addEventListener('click', (e)=> {
        e.preventDefault();
        try {
            if(verificar()) {
                const user = JSON.parse(localStorage.getItem('user'));
                const obj = { email: user.email, password: user.password }
                axios.post('http://localhost:3000/viewjobs', obj)
                .then((response) => {
                    const Usuario = {
                        nomeuser: response.data,
                    }
                    axios.post('http://localhost:3000/ViewTreinamentos_status_0_1', Usuario)
                    .then((response) => {
                        displayTreinamentos(response.data)
                    })
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}


function updateOption(select){
    const user = JSON.parse(localStorage.getItem('user'));
    const obj = { email: user.email, password: user.password }
    axios.post('http://localhost:3000/viewjobs', obj)
        .then((response) => {
            const Usuario = {
                nomeuser: response.data,
            }
            axios.post('http://localhost:3000/ViewTreinamentos_status_0_1', Usuario)
                .then((response) => {
                    const obj = response.data;
                    for (let i = 0; i < select.length; i++) {
                        select.options.remove(0)
                    }
                    for (let i = 0; i < obj.length; i++) {
                        var c = document.createElement("option");
                        c.value = `${obj[i].treinoname}_${obj[i].treinocodigo}`;
                        c.text = obj[i].treinoname;
                        select.options.add(c, i);
                    }
                    //displayTreinamentos(response.data)
                })
        })
}

const NomeTreinamentoForQuiz = document.querySelector('#NomeTreinamentoForQuiz');

updateOption(NomeTreinamentoForQuiz);

const IrParaQuiz_button = document.getElementById('IrParaQuiz');

if (IrParaQuiz_button) {
    IrParaQuiz_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {
                var select = document.getElementById('NomeTreinamentoForQuiz');
	            var option = select.options[select.selectedIndex];
                var nome = option.value.split("_")[0];
                var cod = option.value.split("_")[1];
                let SpecificTreino = {
                    Nome: nome.toUpperCase(),
                    Cod: cod,
                }
                const user = JSON.parse(localStorage.getItem('user'));
                const obj1 = { email: user.email, password: user.password }

                axios.post('http://localhost:3000/viewjobs', obj1)
                .then(response => {
                    const GetStatusAluno = {
                        nomeuser: response.data,
                        treino: nome.toUpperCase(),
                        codigo: cod,
                    }
                    axios.post('http://localhost:3000/get-status', GetStatusAluno)
                    .then(res => {
                        const teste = res.data;
                        if (teste[0].status === '2' || teste[0].status === '3') {
                            alert('aluno já realizou esse treinamento')
                        }
                        else {
                            axios.post('http://localhost:3000/VerifyDateInicioFim', GetStatusAluno)
                            .then(response => {
                                if (response.data) {
                                    axios.post('http://localhost:3000/viewjobs', obj1)
                                    .then(res => {
                                        const Usuario = {
                                            nomeuser: res.data,
                                            treinoname: nome.toUpperCase(),
                                            status: '1'
                                        }
                                        axios.post('http://localhost:3000/UpdateStatusTreino', Usuario);
        
                                        localStorage.setItem('SpecificTreinamento', JSON.stringify(SpecificTreino));

                                        axios.post("http://localhost:3000/get-quiz", SpecificTreino)
                                        .then((res) => {
                                            //saveData(res.data);
                                            localStorage.setItem('dataQuiz', JSON.stringify(res.data));
                                        })

                                        ipcRenderer.send('Janela_QuizApp');
                                    })
                                }
                                else {
                                    alert('Data fora do período de realização do teste!')
                                }
                            })
                        }
                    })
                })
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

const IrParaCase1_button = document.getElementById('Case1');
const curso1_treino = document.querySelector(".curso1_treino")
const VerCurso1_button = document.getElementById('VerCurso1');

function display_curso1() {
    curso1_treino.innerHTML = "";
    const infos1 = JSON.parse(localStorage.getItem('SpecificTreinamento'));
    const treinos_1 = { Name: infos1.Nome, Code: infos1.Cod };
    axios.post('http://localhost:3000/Curso1texto', treinos_1)
    .then(response => {
        const text = response.data;
        //console.log(text);
        const div = document.createElement("div");
        div.innerHTML = `<h2>CURSO INTRODUTÓRIO 1</h2><br><br>
        <h3><p>${text[0].Curso1}</p></h3>
        `;
        
        curso1_treino.appendChild(div);
    })
}

if (VerCurso1_button) {
    VerCurso1_button.addEventListener('click', display_curso1);
}

if (IrParaCase1_button) {
    IrParaCase1_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {;
                ipcRenderer.send('Janela_QuizCase1APP');
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

const IrParaCase2_button = document.getElementById('Case2');
const curso2_treino = document.querySelector(".curso2_treino")
const VerCurso2_button = document.getElementById('VerCurso2');

function display_curso2() {
    curso2_treino.innerHTML = "";
    const infos2 = JSON.parse(localStorage.getItem('SpecificTreinamento'));
    const treinos_2 = { Name: infos2.Nome, Code: infos2.Cod };
    axios.post('http://localhost:3000/Curso2texto', treinos_2)
    .then(response => {
        const text = response.data;
        //console.log(text);
        const div = document.createElement("div");
        div.innerHTML = `<h2>CURSO AVANÇADO E MENTORIA</h2><br><br>
        <h3><p>${text[0].Curso2}</p></h3>
        `;
        
        curso2_treino.appendChild(div);
    })
}

if (VerCurso2_button) {
    VerCurso2_button.addEventListener('click', display_curso2);
}

if (IrParaCase2_button) {
    IrParaCase2_button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (verificar()) {;
                ipcRenderer.send('Janela_QuizCase2APP');
            }
        } 
        catch (e) {
            console.log(e);
        }
    })
}

const VoltarHomeAluno_button = document.getElementById("VoltarHomeAluno");

if(VoltarHomeAluno_button) { 
    VoltarHomeAluno_button.addEventListener('click', (e) => {
        e.preventDefault();
        try{
            ipcRenderer.send('Janela_HomeAlunoPerm');
        }
        catch{
            console.log(e);
        }
    })
}