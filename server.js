const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const upload = multer();

app.post('/', upload.single('image'), async (req, res) => {
  const formData = new FormData();
  formData.append('image', req.file.buffer, {
    filename: req.file.originalname,
  });

  try {
    const response = await axios.post('http://192.168.35.135/add_member', formData, {
      headers: formData.getHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload image.' });
  }
});

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




  app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
  });
