const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const upload = multer();
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json

const connection = mysql.createConnection({
  host: 'ans3.cwmxwotwq2p1.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'ehrjsdn123!',
  database: 'sys'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Page', 'Main.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Page', 'login.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'Page', 'signup.html'));
});


app.post('/signup', (req, res) => {
  // 클라이언트로부터 전송된 데이터 수신
  let userData = req.body;
  console.log(userData)
  // MySQL에 데이터 저장
  connection.query('INSERT INTO signup (username, password, email, phone, name) VALUES (?, ?, ?, ?, ?)', [userData.username, userData.password, userData.email, userData.phone, userData.name], (error, results, fields) => {
    if (error) {
      console.error('MySQL 저장 실패:', error);
      res.status(500).json({ message: '회원가입에 실패했습니다.' });
    } else {
      console.log('MySQL 저장 성공');
      res.json({ message: '회원가입이 완료되었습니다.' });
    }
  });
});


/*
  //클라이언트에서 새로운 회원가입이 오면 
const url = 'http://192.168.35.135:5000/add_member';
const data = {
  key1: '이름',
  key2: '사진'
};

//http://192.168.35.135/add_member
axios.post(url, data)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });

*/
app.use(express.static('public'));
app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
  });
