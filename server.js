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
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Page', 'dashboard.html'));
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
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  

  // MySQL 데이터베이스에서 사용자 정보 검증
  // 이 예시에서는 간단한 비교를 통해 로그인 검증을 수행합니다.
  // 실제로는 bcrypt나 passport 등을 사용하여 안전한 방식으로 비밀번호를 검증해야 합니다.

  const query = `SELECT * FROM signup WHERE username = '${username}'`;
  console.log(query)
  

  connection.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error: ', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    // 사용자 정보가 존재하는 경우
    if (results.length > 0) {
      const user = results[0];

      // 비밀번호가 일치하는 경우
      if (user.password === password) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      // 사용자 정보가 존재하지 않는 경우
      res.status(404).json({ message: 'User not found' });
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
