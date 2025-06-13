const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const path = require('path');
const metadataPath = path.join(__dirname, 'uploads', 'metadata.json');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

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
  const name = req.body.name || 'Anonim';
  const filename = req.file.filename;

  // metadata.json'u oku veya başlat
  fs.readFile(metadataPath, 'utf8', (err, data) => {
    let metadata = [];
    if (!err && data) {
      try {
        metadata = JSON.parse(data);
      } catch (e) {
        console.error('Metadata parse hatası:', e);
      }
    }

    // Yeni veriyi ekle
    metadata.push({ filename, name });

    // metadata.json dosyasına yaz
    fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), err => {
      if (err) {
        console.error('Metadata yazılamadı:', err);
      }
      res.redirect('/');
    });
  });
});

const fs = require('fs');
app.get('/list-photos', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      res.status(500).send('Sunucu hatası');
    } else {
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
      res.json(imageFiles);
    }
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
