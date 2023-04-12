const mysql = require('mysql');  // mysql 모듈 로드
const conn = {  // mysql 접속 설정
    host: 'ans3.cwmxwotwq2p1.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'ehrjsdn123!',
    database: 'ans3'
};


let connection = mysql.createConnection(conn);
connection.connect();

sql = "select * from member";

connection.query(sql,function(err,res,fields){
    if(err){
        console.log(err);
    }

    console.log(res);
})