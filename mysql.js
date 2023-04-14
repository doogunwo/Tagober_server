const express = require('express');
const mysql =require('mysql');
const app = express();
const port =3000




const conn = mysql.createConnection({
  host: 'ans3.cwmxwotwq2p1.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'ehrjsdn123!',
    database: 'sys'
})


conn.connect(function(err){
  if(err) throw err;
  console.log("Connected")

  const sql = "select * from member"

  conn.query(sql,function(err,res){
    if(err) throw err;
    console.log(sql)
    console.log("query done")
  })
})




app.get('/', (req,res)=>{

  const sql = 'select * from member'

  conn.query(sql,function(err,result,field){
    if(err) throw err;
    res.send(result)
  })
})
app.listen(port, ()=> console.log('start'))


