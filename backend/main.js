const { MongoClient } = require("mongodb");
const uri = "mongodb://mongo:kLE9591apUXPdGLyayMu@containers-us-west-44.railway.app:7658";
//const uri = process.env.URI;

//const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri);
require("dotenv").config();
const database = client.db('test');
const user = database.collection('users');

const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const mysql_pool = require('mysql2')
const pool = mysql_pool.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
});

function Encrypt(dados){
  const saltRounds = 10;
  const pass = dados;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(pass,salt);
  return hash;
}

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const dados = req.body;
    dados.password = Encrypt(dados.password);
    try {
        await client.connect();
        const query = {
          email: dados.email,
          senha: dados.password,
          cargo: dados.cargo,
          nome:  dados.nome
        }; 
        await user.insertOne(query);
        //console.log(user);
      } catch(e){
        console.log(e);
      }
      res.send('Sucessfull sign in!');
});

app.post('/login', async (req, res) => {
    const dados = req.body;
    console.log(dados);
    const ver_email = await user.findOne({email: dados.email});
      if(!ver_email){
        console.log("\nUsuario nao encontrado!")
      }
      else{
        console.log("\nEMAIL CORRETO")
        const ver_pass = await bcrypt.compare(dados.password, ver_email.senha);

        if(!ver_pass || ver_pass === undefined){
          console.log("\nSenha invalida!");
          res.status(401).send("Login inválido!");
        }
        else{
          console.log("\nSENHA CORRETA, USUARIO LOGADO");
          const token = jwt.sign({email: dados.email},process.env.SECRET);
       
          res.json({accessToken: token});
        }
    }
});

// banco de dados guitos

app.post('/newjob', async (req, res) => {     // (CREATE)
    const job = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
        
        pool.query(`SELECT * FROM job WHERE JobTitle = '${job.JobTitle}' and Company = '${job.JobCompany}' and Activities = '${job.JobActivities}' and Requiriments = '${job.JobRequiriments}' and Salary = '${job.JobSalary}' and MaxNumber = '${job.JobMaxNumber}'`, (err, result) => {
          if (Objetovazio(result)) {
            pool.query(`INSERT into job (JobTitle, Company, Activities, Requiriments, Salary, MaxNumber) values ('${job.JobTitle}','${job.JobCompany}','${job.JobActivities}','${job.JobRequiriments}','${job.JobSalary}','${job.JobMaxNumber}');`);
            console.log('Vaga cadastrada com sucesso!');
          }
          else {
            console.log('Erro: Vaga já cadastrada!');
          }
        });

      } catch(e){
            console.log(e);
      }
});

app.post('/viewjobs', async(req, res) => {    // retorna o username do usuario logado
    const query = req.body;
    try {
        //console.log(query);
        const result = await user.findOne({email: query.email}, {email: 0, senha: 0, cargo: 0, nome: 1});
        res.json(result.nome);
    }
    catch(e) {
        console.log(e);
    }
});

app.post('/editjob', async (req, res) => {    // (UPDATE)
    const newjob = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
      
        pool.query(`SELECT * FROM job WHERE JobTitle = '${newjob.oldJobTitle}' and Company = '${newjob.oldJobCompany}'`, (err, result) => {
          if(!Objetovazio(result)) {
            var query = `UPDATE job SET JobTitle = ?, Company = ?, Activities = ?, Requiriments = ?, Salary = ?, MaxNumber = ? where JobTitle = ?`;
            pool.query(query, [newjob.newJobTitle, newjob.oldJobCompany, newjob.newJobActivities, newjob.newJobRequiriments, newjob.newJobSalary, newjob.newJobMaxNumber, newjob.oldJobTitle]);

            var query2 = `UPDATE alunojob SET jobname = '${newjob.newJobTitle}' where jobname = '${newjob.oldJobTitle}' and jobcompany = '${newjob.oldJobCompany}'`;
            pool.query(query2, function (err, result) {
            });
            console.log("Vaga alterada com sucesso");
          }
          else {
            console.log('Vaga antiga inexistente no sistema!');
          }
        });

      } catch(e){
        console.log(e);
      }
});

app.post('/readjob', async (req, res) => {      // retorna as vagas cadastradas de determinada empresa (READ)
  const readjob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM job WHERE Company = '${readjob.data}'`, (err, result) => {
          return console.log(result);
      });
      console.log('Vagas cadastradas da empresa ' +  readjob.data + ':');

    } catch(e){
      console.log(e);
    }
});

app.post('/deletejob', async (req, res) => {    // (DELETE)
  const DeleteJob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM job WHERE JobTitle = '${DeleteJob.JobName}' and Company = '${DeleteJob.JobCompany}'`, (err, result) => {
        if(!Objetovazio(result)) {
          pool.query(`Delete FROM job WHERE JobTitle = '${DeleteJob.JobName}' and Company = '${DeleteJob.JobCompany}'`, (err, result) => {
            console.log("Vaga deletada com sucesso!");
            //return console.log(result);
          });
          pool.query(`Delete FROM alunojob WHERE jobname = '${DeleteJob.JobName}' and jobcompany = '${DeleteJob.JobCompany}'`, (err, result) => {});
        }
        else {
          console.log('Vaga inexistente no sistema!');
        }
      });

    } catch(e){
      console.log(e);
    }
});

app.post('/verifycargo', async(req, res) => {     // retorna o cargo do usuario logado
  const userlogin = req.body;
  //console.log(userlogin);
  try {
    const result = await user.findOne({email: userlogin.email}, {email: 0, senha: 0, cargo: 1, nome: 0});
    //console.log(result.cargo);
    res.json(result.cargo);
  }
  catch(e) {
      console.log(e);
  }
})

app.post('/readAlljob', async (req, res) => {     // listagem pros alunos de todas as vagas disponíveis pra cadastro
  //console.log('entrou');
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM job ORDER BY Company`, (err, result) => {
          console.log(result);
          res.json(result);
      });
      
      console.log('Lista de todas as vagas cadastradas: ');
    } catch(e){
      console.log(e);
    }
});

app.post('/CadUsuario', async (req, res) => {   // cadastra o aluno em uma vaga de emprego
  const jobdata = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM job WHERE JobTitle = '${jobdata.jobname}' and Company = '${jobdata.jobcompany}'`, (err, result) => {
        if(!Objetovazio(result)) {
          pool.query(`SELECT * FROM alunojob WHERE alunoname = '${jobdata.nomeuser}' and jobname = '${jobdata.jobname}' and jobcompany = '${jobdata.jobcompany}'`, (err, res) => {
            if(Objetovazio(res)) {
              pool.query(`INSERT into alunojob (alunoname, jobname, jobcompany) values ('${jobdata.nomeuser}','${jobdata.jobname}','${jobdata.jobcompany}');`);
              console.log('Aluno cadastrado com sucesso!');
            }
            else {
              console.log('Aluno já cadastrado nessa vaga!');
            }
          });
        }
        else {
          console.log('Vaga inexistente no sistema!');
        }
      });

    } catch(e){
      console.log(e);
    }
});

function Objetovazio(obj) {
  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) 
      return false
  }
  return true;
}

app.post('/viewstudents', (req, res) => {     // listagem dos alunos cadastrados em uma determinada vaga da empresa logada
  const obj = req.body;

  pool.query(`SELECT * FROM job WHERE JobTitle = '${obj.jobname}' and Company = '${obj.jobcompany}'`, (err, result) => {
    if(!Objetovazio(result)) {
      pool.query(`SELECT alunoname FROM alunojob WHERE jobname = '${obj.jobname}' and jobcompany = '${obj.jobcompany}'`, (err, res) => {
        console.log("Lista de alunos cadastrados: ")
        return console.log(res);
      })
    }
    else {
      console.log('Vaga inexistente no sistema!');
    }
  });
})

app.post('/auth', (req,res) => {
    //console.log(req.headers)
    const token  = req.headers['authorization'];
    const accessToken = token.split(' ')[1]
    //console.log(process.env.SECRET)
    //console.log(accessToken);
    const verify = jwt.verify(accessToken, '12345');

    if(verify === null) res.status(401)

    res.json({status: 'Authorized!'});
})

// Banco de dados Treinamentos -> Ricardo

app.get('/get-quiz', (req,res) => {
    pool.query(`SELECT * FROM quiz;`, (err, response, fields) => {    // Select todos os quiz
      res.json(response); // enviar como response
    });
})

app.post('/HistAcertosQuiz', (req, res) => {        // Histórico de acertos de um aluno em determinado quiz
    const obj = req.body;
    console.log(obj);
    try {
        pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
        });
        pool.query(`INSERT into histacertos (NomeAluno, NomeQuiz, NumAcertos) values ('${obj.NomeAluno}','${obj.NomeQuiz}','${obj.NumAcertos}');`)
    }

    catch(e){
      console.log(e);
    }
})

function verificarData(data){
  const date = new Date();
  if(data[0] < date.getFullYear()) {
    return false;
  }
  else if(data[0] === date.getFullYear() && date[1] < date.getMonth() + 1){
    return false;
  }
  else if(data[0] === date.getFullYear() && date[1] === date.getMonth() + 1 && data[2] < date.getDate()){
    return false;
  }
  return true;
}

app.post("/treinamento_create", async (req, res) => {   // Create novo treinamento
  const cadastro = req.body
  try{
    if(verificarData(cadastro.inicio_inscricoes.split("-")) && verificarData(cadastro.fim_inscricoes.split("-"))){
      pool.connect(function(err) {
        if (err) throw err;
        //console.log("conectou");
    });
    // Fazer a verificação se já existe um treinamento criado 
    // o codigo eh auto incrementado a cada insert na tabela, nao eh mais gerado aleatoriamente 
    pool.query(`INSERT INTO Treinamento (nome_comercial, descricao, carga_horaria, inicio_inscricoes, fim_inscricoes, inicio_treinamento, fim_treinamento, min_inscritos, max_inscritos, QAptidao, QCase1 , QCase2) VALUES ('${cadastro.nome_comercial}', '${cadastro.descricao}', '${cadastro.carga_horaria}', '${cadastro.inicio_inscricoes}', '${cadastro.fim_inscricoes}', '${cadastro.inicio_treinamento}', '${cadastro.fim_treinamento}', '${cadastro.min_inscritos}', '${cadastro.max_inscritos}', '${cadastro.Aptidao}', '${cadastro.case1}', '${cadastro.case2}');`);
    }
    else{
      console.log("data menor")
    }
  }catch(e){
      console.log(e);
  }
})

app.post("/treinamento_read", async (req, res) => {   // Read treinamento especifico
  //const id = req.params.id;
  const obj = req.body;
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`SELECT * FROM Treinamento WHERE nome_comercial = ? and codigo = ?;`, [obj.nome, obj.cod], (err, response) => {
      //res.json(response);
      console.log(response);
    });
  }
  catch(e){
    console.log(e);
  }
})

app.post("/treinamento_update", async (req, res) => {   // Update treinamento especifico
  //const id = req.params.id;
  const cadastro = req.body;
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    var query = `UPDATE Treinamento SET codigo = ?, nome_comercial = ?, descricao = ?, carga_horaria = ?, inicio_inscricoes = ?, fim_inscricoes = ?, inicio_treinamento = ?, fim_treinamento = ?, min_inscritos = ?, max_inscritos = ?, QAptidao = ?, QCase1 = ?, QCase2 = ? where codigo = ? and nome_comercial = ?;`;
    pool.query(query, [cadastro.codigo, cadastro.newnome_comercial, cadastro.newdescricao, cadastro.newcarga_horaria, cadastro.newinicio_inscricoes, cadastro.newfim_inscricoes, cadastro.newinicio_treinamento, cadastro.newfim_treinamento, cadastro.newmin_inscritos, cadastro.newmax_inscritos, cadastro.newQuizAptidao, cadastro.newQuizCase1, cadastro.newQuizCase2, cadastro.codigo, cadastro.oldnome_comercial]);
  }
  catch(e){
    console.log(e);
  }
})

app.post("/DeleteTreinamento", async (req, res) => {   // Delete treinamento especifico
  const objdelete = req.body;
  //console.log(objdelete);
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`DELETE FROM Treinamento WHERE codigo = ? and nome_comercial = ?;`, [objdelete.Cod, objdelete.Nome], (err, response) => {
      //res.json(response);
      console.log('Treinamento deletado com sucesso');
    });
  }
  catch(e){
    console.log(e);
  }
});

app.get('/ViewAllTreinamentos', async (req, res) => {
  pool.query(`SELECT * FROM Treinamento;`, (err, response) => {    // Select todos os treinamentos criados pelos administradores
    console.log(response);
    //res.json(response);
  });
})

app.post('/CadQuestaoQuiz', async (req, res) => {
  const obj = req.body;
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`INSERT INTO quiz (NomeQuiz, PerguntaQuiz, CodigoTreino, RespostaCorreta, RespostaE1, RespostaE2, RespostaE3, RespostaE4) VALUES ('${obj.nomequiz}','${obj.Perg}','${obj.codigo}', '${obj.RespCorreta}', '${obj.Resp1}', '${obj.Resp2}', '${obj.Resp3}', '${obj.Resp4}');`);
    /*pool.query(`SELECT * FROM quiz`, (err, result) => {
      console.log(result);
    });*/
  }
  catch(e){
    console.log(e);
  }
})

app.get('/VerAllQuiz', async (req, res) => {
  try{
    pool.connect(function(err) {
      if (err) throw err;
    });
    pool.query(`SELECT NomeQuiz FROM quiz GROUP BY NomeQuiz`, (err, result) => {
      console.log(result);
    });
  }
  catch(e){
    console.log(e);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});