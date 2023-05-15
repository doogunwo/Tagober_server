const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'ans3.cwmxwotwq2p1.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'ehrjsdn123!',
    database: 'sys'
  });

function checkFace(loggedInUser){
    //데이터 베이스 조회
    const username = loggedInUser;
    const isRegistered = false;
    const query = `SELECT name FROM signup WHERE username = '`+username+`'`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('MySQL query error: ', err);
       
      }
      
      // 사용자 정보가 존재하는 경우
      if (results.length > 0) {
        console.log(results[0])
      }
    });
  }
const loggedInUser = 'dgw0601';
checkFace(loggedInUser);

