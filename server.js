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
  const { username, password, email, phone, name } = req.body;
  console.log(req.body);
  // 회원 정보를 MySQL에 저장
  const query = `INSERT INTO signup (username, password, email, phone, name) VALUES (?, ?, ?, ?, ?)`;
  const values = [username, password, email, phone, name];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving signup data to MySQL: ', err);
      res.status(500).send('Error saving signup data');
      return;
    }

    console.log('Signup data saved to MySQL');
    res.status(200).send('Signup successful');
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
