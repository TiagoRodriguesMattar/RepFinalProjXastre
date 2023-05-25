const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;


require("dotenv").config();
const jwt = require('jsonwebtoken');

const mysql_pool = require('mysql2');

var pool = mysql_pool.createConnection({
    host: "localhost",
    user: "root",
    password: "123456"
});


app.post('/auth', async (req, res) => {
   
    const token = req.headers.authorization;
    const accessToken = token.split(' ')[1];
    
    const verify = jwt.verify(accessToken, process.env.SECRET);
    console.log(verify)
    if(verify === null) return res.status(401).json({status: "Unauthorized"});

    return res.json({status: 'Autenticado'});

});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

