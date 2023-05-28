const { MongoClient } = require("mongodb");
const uri = "mongodb://mongo:kLE9591apUXPdGLyayMu@containers-us-west-44.railway.app:7658"

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
    host: 'localhost',
    user: 'root',
    password: 'Acdcacdc16@',
    database: "xastreprojeto"
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
    //console.log('entrei db login')
    const dados = req.body;
    console.log(dados);
    const ver_email = await user.findOne({email: dados.email});
      if(!ver_email){
        console.log("\nUsuario nao encontrado!")
        //res.status(401).send("Usuario não encontrado!");
      }
      else{
        console.log("\nEMAIL CORRETO")
        const ver_pass = await bcrypt.compare(dados.password, ver_email.senha);

        if(!ver_pass){
        console.log("\nSenha invalida!");
        //res.status(401).send("Senha inválida!");
        }
        else{
        console.log("\nSENHA CORRETA, USUARIO LOGADO");
        }
       const token = jwt.sign({email: dados.email},process.env.SECRET);
       
       res.json({accessToken: token});
    }
});

// banco de dados guitos

app.post('/newjob', async (req, res) => {
    const job = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
      
        pool.query(`INSERT into job (JobTitle, Company, Activities, Requiriments, Salary, MaxNumber) values ('${job.JobTitle}','${job.JobCompany}','${job.JobActivities}','${job.JobRequiriments}','${job.JobSalary}','${job.JobMaxNumber}');`);
        console.log('Vaga cadastrada com sucesso!');
      
        /*pool.end(() => {
            console.log("Connection succesfully closed");
        });*/
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

app.post('/editjob', async (req, res) => {
    const newjob = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
      
        var query = `UPDATE xastreprojeto.job SET JobTitle = ?, Company = ?, Activities = ?, Requiriments = ?, Salary = ?, MaxNumber = ? where JobTitle = ?`;
        pool.query(query, [newjob.newJobTitle, newjob.oldJobCompany, newjob.newJobActivities, newjob.newJobRequiriments, newjob.newJobSalary, newjob.newJobMaxNumber, newjob.oldJobTitle]);
        
        console.log("Vaga alterada com sucesso");
        /*pool.end(() => {
            console.log("Connection succesfully closed");
        });*/ 
      } catch(e){
        console.log(e);
      }
});

app.post('/readjob', async (req, res) => {
  const readjob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM xastreprojeto.job WHERE Company = '${readjob.data}'`, (err, result) => {
          return console.log(result);
      });
      console.log('Vagas cadastradas da empresa ' +  readjob.data + ':');

    } catch(e){
      console.log(e);
    }
});

app.post('/deletejob', async (req, res) => {
  const DeleteJob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`Delete FROM xastreprojeto.job WHERE JobTitle = '${DeleteJob.JobName}' and Company = '${DeleteJob.JobCompany}'`, (err, result) => {
          return console.log(result);
      });

      console.log("Vaga deletada com sucesso!");
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

app.post('/readAlljob', async (req, res) => {
  //console.log('entrou');
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM xastreprojeto.job ORDER BY Company`, (err, result) => {
          return console.log(result);
      });
      
      console.log('Lista de todas as vagas cadastradas: ');
    } catch(e){
      console.log(e);
    }
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});