const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
//Node.js 서버에서 HTTP 요청 처리하기
// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'your-mysql-host.com',
    user: 'your-mysql-username',
    password: 'your-mysql-password',
    database: 'your-mysql-database'
});

connection.connect();

// HTTP POST 요청 처리
app.post('/', function (req, res) {
    // 요청 데이터 가져오기
    const requestData = req.body;

    // MySQL 데이터베이스에 쿼리 실행
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const params = [requestData.username, requestData.password];
    connection.query(sql, params, function (error, results, fields) {
        if (error) throw error;

        // 결과 응답하기
        res.send(results);
    });
});

app.listen(3000, function () {
    console.log('Node.js server is listening on port 3000!');
});
