const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const upload = multer();
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { Console } = require('console');
const { userInfo } = require('os');
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
app.post('/upload', upload.single('image'), (req, res) => {
  const username = req.session.username; // 로그인된 사용자의 이름
  const file = req.file; // 수신된 이미지 파일

  // 사용자 폴더 경로 생성
  const userFolderPath = path.join(__dirname, 'Data', username);
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }

  // 이미지 저장 경로 설정
  const imageFolderPath = path.join(userFolderPath, 'images');
  if (!fs.existsSync(imageFolderPath)) {
    fs.mkdirSync(imageFolderPath);
  }
  const imagePath = path.join(imageFolderPath, file.originalname);
  console.log(file.path, imagePath)
  // 이미지 파일 이동 및 저장
  fs.renameSync(file.path, imagePath);
  // 이미지 저장이 완료되면 디비에 이미지에 대한 path를 저장해야함. 이 부분 연구하기. 디비에 어떻게 이미지를 저장할까?
  res.send('이미지 전송 및 저장 완료');
});

app.post('/checkFace', (req,res)=>{
  //이미지 저장이 되어 있으면 이미지 버튼 비활성화하기 


})

function checkFace(){
  
}
app.use(express.static('public'));
app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
  });
