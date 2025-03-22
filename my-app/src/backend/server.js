// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Store uploaded audio files in /uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/analyze', upload.single('audio'), (req, res) => {
  const audioPath = path.join(__dirname, req.file.path);

  // Run Python scam model
  execFile('python', ['scam_model.py', audioPath], (err, stdout, stderr) => {
    if (err) {
      console.error('Python error:', stderr);
      return res.status(500).json({ error: 'Analysis failed.' });
    }

    const result = JSON.parse(stdout);
    res.json(result);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
