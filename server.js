const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { Console } = require('console');
const { userInfo } = require('os');
const fs = require('fs');
app.use(bodyParser.json()) // for parsing application/json
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
const session = require('express-session');


app.use(
  session({
    secret: 'your-secret-key', // 세션 암호화를 위한 비밀 키
    resave: false, // 변경이 없더라도 세션을 항상 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
    // 추가적인 옵션 설정 가능 (예: 쿠키 설정, 세션 저장소 등)
  })
);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'Data/'+req.session.username+'/';
    const destination = path.join(__dirname, uploadDir);

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, uploadDir);


  },
  filename: function (req, file, cb) {
    // 파일 이름을 현재 시간으로 설정하여 중복을 피함
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});



const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '1234',
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
   // 쿠키 설정
    res.sendFile(path.join(__dirname, 'Page', 'dashboard.html'));
});

app.get('/getUsername', (req, res) => {
  const username = req.session.username; // 세션에서 회원 이름 가져오기
  res.json({ username }); // 회원 이름을 JSON 형식으로 응답
});


app.post('/signup', (req, res) => {
  // 클라이언트로부터 전송된 데이터 수신
  let userData = req.body;
  console.log(userData)
  // MySQL에 데이터 저장
  connection.query('INSERT INTO signup (username, password, name, email, phone) VALUES (?, ?, ?, ?, ?)', [userData.username, userData.password, userData.name, userData.email, userData.phone], (error, results, fields) => {
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
  req.session.username = username;
  // MySQL 데이터베이스에서 사용자 정보 검증
  // 이 예시에서는 간단한 비교를 통해 로그인 검증을 수행합니다.
  // 실제로는 bcrypt나 passport 등을 사용하여 안전한 방식으로 비밀번호를 검증해야 합니다.
  const query = `SELECT * FROM signup WHERE username = '${username}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error: ', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    
    // 사용자 정보가 존재하는 경우
    if (results.length > 0) {
      const user = results[0];
      console.log(user)
      
      
      // 비밀번호가 일치하는 경우
      if (user.password === password) {
        console.log("username",user.name);
        
        res.sendStatus(200);
       
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      // 사용자 정보가 존재하지 않는 경우
      res.status(404).json({ message: 'User not found' });
    }
  });




  
});

const upload = multer({ storage: storage }).single('image');
app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // 업로드 중에 에러가 발생한 경우
      console.log('Multer Error:', err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // 기타 에러가 발생한 경우
      console.log('Other Error:', err);
      return res.status(500).json({ error: 'An error occurred during upload.' });
    }

    // 이미지가 정상적으로 전송되었을 때
    const imagePath = req.file.path; // 저장된 이미지의 경로
    console.log('Image Path:', imagePath);

    // 추가적인 작업 수행 가능

    return res.status(200).json({ success: true });
  });
});



app.use(express.static('public'));
app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
  });
