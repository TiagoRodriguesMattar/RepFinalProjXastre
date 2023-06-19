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

const Objetovazio = require('./tests/Objetovazio');

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
    if(!Objetovazio(dados)){
      try {
        await client.connect();
        const query = {
          email: dados.email,
          senha: dados.password,
          cargo: dados.cargo,
          nome:  dados.nome
        }; 
        const a = await user.insertOne(query);
        //console.log(a);
      } catch(e){
        console.log(e);
      }
      res.send('Sucessfull sign in!');
    }   
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
            res.status(200).json({ valor: '1' })
          }
          else {
            console.log('Erro: Vaga já cadastrada!');
            res.status(200).json({ valor: '0' })
          }
        });

      } catch(e){
            console.log(e);
            res.status(500).json({ valor: '0' });
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

app.get('/get-AllCompanies', async(req, res) => {
  pool.query(`SELECT Company from job group by Company`, (err, result) => {
    res.json(result)
  })
})

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
            res.status(200).json({ valor: '1' })
          }
          else {
            console.log('Vaga antiga inexistente no sistema!');
            res.status(200).json({ valor: '0' })
          }
        });

      } catch(e){
        console.log(e);
        res.status(500).json({ valor: '0' })
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
          res.json(result);
          //return console.log(result);
      });
      //console.log('Vagas cadastradas da empresa ' +  readjob.data + ':');

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
            //return console.log(result);]
          });
          pool.query(`Delete FROM alunojob WHERE jobname = '${DeleteJob.JobName}' and jobcompany = '${DeleteJob.JobCompany}'`, (err, result) => {});
          res.status(200).json({ valor: '1' })
        }
        else {
          console.log('Vaga inexistente no sistema!');
          res.status(200).json({ valor: '0' })
        }
      });

    } catch(e){
      console.log(e);
      res.status(500).json({ valor: '0' })
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

app.post('/CadUsuario', async (req, res) => {
  const jobdata = req.body;
  const retorno = {
    valor: '',
  }

  try {
    pool.connect(function(err) {
      if (err) throw err;
    });

    pool.query(`SELECT * FROM job WHERE JobTitle = '${jobdata.jobname}' and Company = '${jobdata.jobcompany}'`, (err, result) => {
      if (!Objetovazio(result)) {
        pool.query(`SELECT * FROM alunojob WHERE alunoname = '${jobdata.nomeuser}' and jobname = '${jobdata.jobname}' and jobcompany = '${jobdata.jobcompany}'`, (err, alunoResult) => {
          if (Objetovazio(alunoResult)) {
            pool.query(`SELECT MaxNumber from job where JobTitle = ? and Company = ?`, [jobdata.jobname, jobdata.jobcompany], (err, r1) => {
              pool.query(`SELECT count(*) as contagem from alunojob where jobname = ? and jobcompany = ?`, [jobdata.jobname, jobdata.jobcompany], (err, r2) => {
                if (r2[0].contagem >= r1[0].MaxNumber) {
                  console.log('falhou');
                  res.json({ valor: '0' });
                } else {
                  pool.query(`INSERT into alunojob (alunoname, jobname, jobcompany) values ('${jobdata.nomeuser}','${jobdata.jobname}','${jobdata.jobcompany}');`, (err, r3) => {
                    if (r3.affectedRows === 1) {
                      retorno.valor = '1';
                      res.json(retorno);
                    } else {
                      retorno.valor = '0';
                      res.json(retorno);
                    }
                  });
                }
              });
            });
          } else {
            console.log('Aluno já cadastrado nessa vaga!');
            res.json({ valor: '0' });
          }
        });
      } else {
        console.log('Vaga inexistente no sistema!');
        res.json({ valor: '0' });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ valor: '0' });
  }
});


/*function Objetovazio(obj) {
  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) 
      return false
  }
  return true;
}*/

app.post('/viewstudents', (req, res) => {     // listagem dos alunos cadastrados em uma determinada vaga da empresa logada
  const obj = req.body;

  pool.query(`SELECT * FROM job WHERE JobTitle = '${obj.jobname}' and Company = '${obj.jobcompany}'`, (err, result) => {
    if(!Objetovazio(result)) {
      pool.query(`SELECT alunoname FROM alunojob WHERE jobname = '${obj.jobname}' and jobcompany = '${obj.jobcompany}'`, (err, response) => {
        //console.log("Lista de alunos cadastrados: ")
        //console.log(response);
        res.json(response);
      })
    }
    else {
      console.log('Vaga inexistente no sistema!');
    }
  });
})

app.post('/ShowVagas_alunosInscritos', (req, res) => {    // retorna as vagas que um determinado aluno está cadastrado
  const obj = req.body;

  pool.query(`SELECT jobname, jobcompany FROM alunojob WHERE alunoname = ?`, [obj.nomeAluno], (err, result) => {
    res.json(result)
  })
})

// retorna os números de acertos nos quizzes dos alunos cadastrados em alguma vaga de uma empresa -> parte empresa
app.post('/ViewNotasAlunos', (req, res) => {
  const obj = req.body;

  pool.query(`SELECT * FROM job WHERE Company = ?`, [obj.nomeuser], (err, r) => {
    if (!Objetovazio(r)) {
      pool.query(`SELECT alunoname FROM alunojob WHERE jobcompany = ? group by alunoname`, [obj.nomeuser], (err, result) => {
        if (!Objetovazio(result)) {
          const promises = result.map(i => {
            return new Promise((resolve, reject) => {
              pool.query(`SELECT * FROM histacertos WHERE NomeAluno = ?`, [i.alunoname], (err, response) => {
                resolve(response); // Resolve a promessa com o resultado da consulta
              });
            });
          });
  
          Promise.all(promises).then(results => {
            const combinedResult = arrayToSingleObject(results.flat()); // Combina todos os resultados em um único array e transforma em objeto
  
            console.log(combinedResult);
            res.json(combinedResult)
          });
        }
      });
    }
  });
  
  
})

function arrayToSingleObject(arr) {
  const result = {};
  if (arr.length > 0) {
    Object.keys(arr[0]).forEach(key => {
      result[key] = arr.map(obj => obj[key]);
    });
  }
  return result;
}


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

app.post('/get-quiz', (req,res) => {      // retorna o quiz de aptidao
    const obj = req.body;

    pool.query(
      `SELECT QAptidao FROM Treinamento WHERE nome_comercial = ? AND codigo = ?`,
      [obj.Nome, obj.Cod],
      (err, result) => {
        if (err) {
          // Trate o erro aqui, se necessário
          console.error(err);
          return;
        }
    
        const { QAptidao } = result[0]; // Obtém os valores da primeira linha do resultado
    
        pool.query(
          `SELECT * FROM quiz WHERE NomeQuiz = ?`,
          [QAptidao],
          (err, response, fields) => {
            if (err) {
              // Trate o erro aqui, se necessário
              console.error(err);
              return;
            }
    
            //console.log(response);
            res.json(response);
          }
        );
      }
    );
    
})

app.post('/get-case1', (req,res) => {        // retorna o quiz do case 1
  const obj = req.body;

  pool.query(
    `SELECT QCase1 FROM Treinamento WHERE nome_comercial = ? AND codigo = ?`,
    [obj.Nome, obj.Cod],
    (err, result) => {
      if (err) {
        // Trate o erro aqui, se necessário
        console.error(err);
        return;
      }

      const { QCase1 } = result[0]; // Obtém os valores da primeira linha do resultado
  
      pool.query(
        `SELECT * FROM quiz WHERE NomeQuiz = ?`,
        [QCase1],
        (err, response, fields) => {
          if (err) {
            // Trate o erro aqui, se necessário
            console.error(err);
            return;
          }
  
          //console.log(response);
          res.json(response);
        }
      );
    }
  );
  
})

app.post('/get-case2', (req,res) => {        // retorna o quiz do case 2
  const obj = req.body;

  pool.query(
    `SELECT QCase2 FROM Treinamento WHERE nome_comercial = ? AND codigo = ?`,
    [obj.Nome, obj.Cod],
    (err, result) => {
      if (err) {
        // Trate o erro aqui, se necessário
        console.error(err);
        return;
      }

      const { QCase2 } = result[0]; // Obtém os valores da primeira linha do resultado
  
      pool.query(
        `SELECT * FROM quiz WHERE NomeQuiz = ?`,
        [QCase2],
        (err, response, fields) => {
          if (err) {
            // Trate o erro aqui, se necessário
            console.error(err);
            return;
          }
  
          //console.log(response);
          res.json(response);
        }
      );
    }
  );
  
})

app.post('/Curso1texto', (req, res) => {      // retorna o texto para o curso introdutório de um determinado treinamento
  const obj = req.body;
  try {
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`SELECT Curso1 FROM Treinamento where nome_comercial = ? and codigo = ?`, [obj.Name, obj.Code] , (err, result, fields) => {
      //console.log(result);
      res.json(result);
    })
  }

  catch(e){
    console.log(e);
  }
})

app.post('/Curso2texto', (req, res) => {        // retorna o texto para o curso avançado e mentoria de um determinado treinamento
  const obj = req.body;
  try {
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`SELECT Curso2 FROM Treinamento where nome_comercial = ? and codigo = ?`, [obj.Name, obj.Code] , (err, result, fields) => {
      //console.log(result);
      res.json(result);
    })
  }

  catch(e){
    console.log(e);
  }
})

app.post('/HistAcertosQuiz', (req, res) => {        // Histórico de acertos de um aluno em determinado quiz
    const obj = req.body;
    //console.log(obj);
    try {
        pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
        });
        pool.query(`SELECT * from histacertos where NomeAluno = ? and NomeQuiz = ?`, [obj.NomeAluno, obj.NomeQuiz], (err, result) => {
          if (Objetovazio(result)) {
            pool.query(`INSERT into histacertos (NomeAluno, NomeQuiz, NumAcertos) values ('${obj.NomeAluno}','${obj.NomeQuiz}','${obj.NumAcertos}');`)
          }
          else {
            console.log('Usuário já realizou o Quiz');
          }
        })
        pool.query(`SELECT * FROM histacertos`, (err, response, fields) => {
          console.log(response);
        })
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

app.post("/treinamento_create", async (req, res) => {
  const cadastro = req.body;
  console.log(cadastro);
  try {
    if (verificarData(cadastro.inicio_inscricoes.split("-")) && verificarData(cadastro.fim_inscricoes.split("-"))) {
      pool.connect(function (err) {
        if (err) throw err;
      });

      pool.query(`SELECT * FROM Treinamento WHERE nome_comercial = ?`, [cadastro.nome_comercial], (err, result) => {
        if (Objetovazio(result)) {
          pool.query(`SELECT * FROM quiz WHERE NomeQuiz IN (?, ?, ?)`, [cadastro.Aptidao, cadastro.case1, cadastro.case2], (err, quizResult) => {
            if (!Objetovazio(quizResult)) {
              pool.query(`INSERT INTO Treinamento (nome_comercial, descricao, carga_horaria, inicio_inscricoes, fim_inscricoes, inicio_treinamento, fim_treinamento, min_inscritos, max_inscritos, QAptidao, QCase1 , QCase2, Curso1, Curso2) VALUES ('${cadastro.nome_comercial}', '${cadastro.descricao}', '${cadastro.carga_horaria}', '${cadastro.inicio_inscricoes}', '${cadastro.fim_inscricoes}', '${cadastro.inicio_treinamento}', '${cadastro.fim_treinamento}', '${cadastro.min_inscritos}', '${cadastro.max_inscritos}', '${cadastro.Aptidao}', '${cadastro.case1}', '${cadastro.case2}', '${cadastro.curso1}', '${cadastro.curso2}');`, (err, insertResult) => {
                console.log('Treinamento cadastrado com sucesso');
                res.status(200).json({ valor: '1' });
              });
            } else {
              console.log('Quiz inexistente. Impossível realizar o cadastro!');
              res.status(200).json({ valor: '0' });
            }
          });
        } else {
          console.log('Treinamento já existente. Impossível realizar o cadastro!');
          res.status(200).json({ valor: '0' });
        }
      });
    } else {
      console.log("data menor");
      res.status(200).json({ valor: '0' });
    }
  } catch (e) {
    res.status(500).json({ valor: '0' });
    console.log(e);
  }
});


app.post("/treinamento_read", async (req, res) => {   // Read treinamento especifico
  //const id = req.params.id;
  const obj = req.body;
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    pool.query(`SELECT * FROM Treinamento WHERE nome_comercial =?  and codigo = ?;`, [obj.nome, obj.cod], (err, response) => {
      res.json(response);
      //console.log(response);
    });
  }
  catch(e){
    console.log(e);
  }
})

app.post("/treinamento_update", async (req, res) => {   // Update treinamento especifico
  //const id = req.params.id;
  const cadastro = req.body;
  console.log(cadastro);
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    var query = `UPDATE Treinamento SET codigo = ?, nome_comercial = ?, descricao = ?, carga_horaria = ?, inicio_inscricoes = ?, fim_inscricoes = ?, inicio_treinamento = ?, fim_treinamento = ?, min_inscritos = ?, max_inscritos = ?, QAptidao = ?, QCase1 = ?, QCase2 = ?, Curso1 = ?, Curso2 = ? where codigo = ? and nome_comercial = ?;`;
    pool.query(query, [cadastro.codigo, cadastro.newnome_comercial, cadastro.newdescricao, cadastro.newcarga_horaria, cadastro.newinicio_inscricoes, cadastro.newfim_inscricoes, cadastro.newinicio_treinamento, cadastro.newfim_treinamento, cadastro.newmin_inscritos, cadastro.newmax_inscritos, cadastro.newQuizAptidao, cadastro.newQuizCase1, cadastro.newQuizCase2, cadastro.newCurso1, cadastro.newCurso2, cadastro.codigo, cadastro.oldnome_comercial], (err, result) => {
      res.status(200).json({ valor: '1' })
    });

    var query2 = `UPDATE alunoTreinamento SET treinoname = ? where treinoname = ? AND treinocodigo = ?`;
    pool.query(query2, [cadastro.newnome_comercial, cadastro.oldnome_comercial,cadastro.codigo],(err, res) => {
      console.log('aluno atualizado')
    })
  }
  catch(e){
    console.log(e);
    res.status(500).json({ valor: '0' })
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
      pool.query(`DELETE FROM alunoTreinamento WHERE treinoname = ? and treinocodigo = ?`, [objdelete.Nome, objdelete.Cod]);
      console.log('Treinamento deletado com sucesso');
      res.status(200).json({ valor: '1' })
    });
  }
  catch(e){
    console.log(e);
    res.status(200).json({ valor: '0' })
  }
});

app.get('/ViewAllTreinamentos', async (req, res) => {
  pool.query(`SELECT * FROM Treinamento;`, (err, response) => {    // Select todos os treinamentos criados pelos administradores
    //console.log(response);
    res.json(response);
  });
})

app.get('/ViewTreinamentosAgora', async (req, res) => {
  pool.query(`SELECT * FROM Treinamento WHERE inicio_inscricoes <= CURDATE() AND fim_inscricoes >= CURDATE();`, (err, response) => {    // Select todos os treinamentos criados pelos administradores
    //console.log(response);
    res.json(response);
  });
})

app.post('/ViewTreinamentos_alunosCadastrados', async (req, res) => {    // seleciona todos os treinamentos em que o usuário está cadastrado
  const obj = req.body;
  /*pool.query(`DELETE FROM alunoTreinamento`);
  pool.query(`SELECT * FROM alunoTreinamento`, (err, res) => {
    console.log(res);
  })*/
  pool.query(`SELECT treinoname, treinocodigo FROM alunoTreinamento WHERE alunoname = ?;`, [obj.nomeuser], (err, response) => {    // Select todos os treinamentos criados pelos administradores
    //console.log(response);
    res.json(response);
  });
})

app.post('/ViewTreinamentos_status_0_1', async (req, res) => {    // seleciona todos os treinamentos em que o usuário está cadastrado e não tenha concluído
  const obj = req.body;
  /*pool.query(`DELETE FROM alunoTreinamento`);
  pool.query(`SELECT * FROM alunoTreinamento`, (err, res) => {
    console.log(res);
  })*/

  pool.query(`SELECT treinoname, treinocodigo FROM alunoTreinamento WHERE alunoname = ? AND status IN (?, ?);`, [obj.nomeuser, '0', '1'], (err, response) => {    // Select todos os treinamentos criados pelos administradores
    res.json(response)
  });
})

app.post('/VerifyDateInicioFim', (req, res) => {
  const obj = req.body;

  pool.query(`SELECT inicio_treinamento, fim_treinamento from Treinamento where nome_comercial = ? and codigo = ? and inicio_treinamento < CURDATE() and fim_treinamento > CURDATE()`, [obj.treino, obj.codigo], (err, response) => {
    if (!Objetovazio(response)) {
      res.json(true)
    }
    else {
      res.json(false)
    }
  })
})

app.post('/CadQuestaoQuiz', async (req, res) => {           // Cadastra um quiz, parte do ADM
  const obj = req.body;
  try{
    pool.connect(function(err) {
      if (err) throw err;
      //console.log("conectou");
    });
    
    //pool.query(`DELETE FROM quiz WHERE NomeQuiz = 'MATEMÁTICA INTERMEDIÁRIA'`);
    pool.query(`INSERT INTO quiz (NomeQuiz, PerguntaQuiz, CodigoTreino, RespostaCorreta, RespostaE1, RespostaE2, RespostaE3, RespostaE4) VALUES ('${obj.nomequiz}','${obj.Perg}','${obj.codigo}', '${obj.RespCorreta}', '${obj.Resp1}', '${obj.Resp2}', '${obj.Resp3}', '${obj.Resp4}');`);
    pool.query(`SELECT * FROM quiz`, (err, result) => {
      console.log(result);
    });
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
    /*pool.query(`SELECT * FROM quiz`, (err, result) => {
      console.log(result);
    });*/
    pool.query(`SELECT NomeQuiz FROM quiz GROUP BY NomeQuiz`, (err, result) => {
      res.json(result);
      //console.log(result);
    });
  }
  catch(e){
    console.log(e);
  }
})

app.post('/DeleteQuiz', async (req, res) => {
  const obj = req.body;
  
  pool.query(`SELECT * FROM quiz where NomeQuiz = ?`, [obj.Nome] , (err, result) => {
    if (!Objetovazio(result)) {
      pool.query(`DELETE from quiz where NomeQuiz = ?`, [obj.Nome], (err, res) => {
        console.log('Quiz deletado com sucesso!');
      });
      pool.query(`DELETE from histacertos where NomeQuiz = ?`, [obj.Nome])
      pool.query(`DELETE FROM Treinamento where QAptidao = ? or QCase1 = ? or QCase2 = ?`, [obj.Nome, obj.Nome, obj.Nome])
      res.status(200).json({ valor: '1' })
    }
    else {
      res.status(200).json({ valor: '0' })
    }
  })
})

app.post('/CadUsuarioTreino', async (req, res) => {
  const obj = req.body;
  const retorno = {
    valor: '',
  }

  try {
    pool.connect(function(err) {
      if (err) throw err;
    });

    pool.query(`SELECT * FROM Treinamento WHERE nome_comercial = '${obj.treinoname}' and codigo = '${obj.treinocodigo}'`, (err, result) => {
      if (!Objetovazio(result)) {
        pool.query(`SELECT * FROM alunoTreinamento WHERE alunoname = '${obj.nomeuser}' and treinoname = '${obj.treinoname}' and treinocodigo = '${obj.treinocodigo}'`, (err, alunoResult) => {
          if (Objetovazio(alunoResult)) {
            pool.query(`SELECT * FROM Treinamento WHERE nome_comercial = ? and codigo = ? and inicio_inscricoes <= CURDATE() AND fim_inscricoes >= CURDATE()`, [obj.treinoname, obj.treinocodigo], (err, validResult) => {
              if (!Objetovazio(validResult)) {
                pool.query(`SELECT min_inscritos, max_inscritos from Treinamento where nome_comercial = ? and codigo = ?`, [obj.treinoname, obj.treinocodigo], (err, countResult) => {
                  pool.query(`SELECT count(*) as contagem from alunoTreinamento where treinoname = ? and treinocodigo = ?`, [obj.treinoname, obj.treinocodigo], (err, r2) => {
                    if (r2[0].contagem >= countResult[0].max_inscritos || r2[0].contagem < countResult[0].min_inscritos) {
                      console.log('falhou')
                      res.status(200).json({ valor: '0' });
                    } else {
                      pool.query(`INSERT into alunoTreinamento (alunoname, treinoname, treinocodigo, status) values ('${obj.nomeuser}','${obj.treinoname}','${obj.treinocodigo}', '0');`, (err, r3) => {
                        if (r3.affectedRows === 1) {
                          retorno.valor = '1';
                          res.status(200).json(retorno);
                        } else {
                          retorno.valor = '0';
                          res.status(200).json(retorno);
                        }
                      });
                    }
                  })
                })
              } else {
                console.log('fora do período de inscrição')
                res.status(200).json({ valor: '0' });
              }
            })
          } else {
            console.log('Aluno já cadastrado nesse treinamento!');
            res.status(200).json({ valor: '0' });
          }
        });
      } else {
        console.log('Treinamento inexistente no sistema!');
        res.status(200).json({ valor: '0' });
      }
    });
  } catch(e) {
    console.log(e);
    res.status(500).json({ valor: '0' });
  }
})


app.post('/UpdateStatusTreino', async (req,res) => {
  
  const obj = req.body;
  console.log(obj);

  pool.query(`UPDATE alunoTreinamento SET status = ? WHERE alunoname = ? and treinoname = ?`, [obj.status, obj.nomeuser, obj.treinoname])
  /*pool.query(`SELECT status from alunoTreinamento WHERE alunoname = ? and treinoname = ?`, [obj.nomeuser, obj.treinoname], (err,response) => {
    console.log(res); 
   });*/
});

app.post('/get-status', async (req,res) => {
  const obj = req.body;

  pool.query(`SELECT status from alunoTreinamento WHERE alunoname = ? and treinoname = ? and treinocodigo = ?`, [obj.nomeuser, obj.treino, obj.codigo], (err,response) => {
    console.log(response);
    res.json(response);
  })
});

// endpoint para retornar o historico de todos os alunos

app.get('/Show_Hist_All_Alunos', async (req,res) => {
    var Aprovados = {};
    var Reprovados = {};

    var obj2 = {
      Aprovados,
      Reprovados
    }

    pool.query(`SELECT alunoname, treinoname, status from alunoTreinamento WHERE status = '2';`, (err, result) => {
      result.forEach( i => {
          i.status = 'Aprovado';
      })
      //console.log(result)
      obj2.Aprovados = result;
    })

    pool.query(`SELECT alunoname, treinoname, status from alunoTreinamento WHERE status = '3'`, (err, result) => {
      result.forEach( i => {
        i.status = 'Reprovado';
    })
      //console.log(result)
      obj2.Reprovados = result;
      console.log(obj2);
      res.json(obj2);
    })
})

// endpoint para retornar o historico de 1 aluno

app.post('/Show_Hist_Aluno', async (req,res) => {
  var Aprovados = {};
  var Reprovados = {};
  var obj = req.body;

  console.log(obj.nomeAluno);

  var obj2 = {
    Aprovados,
    Reprovados
  }

  pool.query(`SELECT treinoname, status from alunoTreinamento WHERE alunoname = ? and status = ?`, [obj.nomeAluno, '2'], (err, result) => {
    result.forEach( i => {
        i.status = 'Aprovado';
    })
    //console.log(result)
    obj2.Aprovados = result;
  })

  pool.query(`SELECT treinoname, status from alunoTreinamento WHERE alunoname = ? and status = ?`, [obj.nomeAluno, '3'], (err, result) => {
    result.forEach( i => {
      i.status = 'Reprovado';
  })
    //console.log(result)
    obj2.Reprovados = result;
    console.log(obj2);
    res.json(obj2);
  })
})

// endpoint para retornar o historico das ultimas 10 atividades dos alunos - MENTOR

app.get('/get-atividades-mentor', async (req,res) => {
  var Aprovados = {};
  var Reprovados = {};

  var obj2 = {
    Aprovados,
    Reprovados
  }

  pool.query(`SELECT alunoname, treinoname, status from alunoTreinamento WHERE status = '2' LIMIT 0, 10;`, (err, result) => {
    result.forEach( i => {
        i.status = 'Aprovado';
    })
    //console.log(result)
    obj2.Aprovados = result;
  })

  pool.query(`SELECT alunoname, treinoname, status from alunoTreinamento WHERE status = '3' LIMIT 0, 10`, (err, result) => {
    result.forEach( i => {
      i.status = 'Reprovado';
  })
    //console.log(result)
    obj2.Reprovados = result;
    console.log(obj2);
    res.json(obj2);
  })
})

app.get('/get-NotasAllAlunos', (req, res) => {
  pool.query(`SELECT * FROM histacertos`, (err, result) => {
    res.json(result);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});