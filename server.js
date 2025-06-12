const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = req.body.name.replace(/\s+/g, '_');
    const filename = `${Date.now()}_${name}_${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  res.send('Yükleme başarılı!');
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
